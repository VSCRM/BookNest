/**
 * Drives the admin "Add book" panel: loads the catalog, manages the
 * create/edit form, and validates that every field with a Ukrainian value
 * also has its English counterpart filled in (mirrors the Rails
 * `Book#validates ..., on: :admin_write` rules server-side, but gives
 * the admin the "please fill in English too" nudge immediately instead
 * of waiting for a round-trip).
 */
import {useState, useEffect, useCallback} from "react";
import {useLocale} from "../i18n/LocaleContext";
import {
	adminBooksService,
	type AdminBook,
	type AdminBookInput,
} from "../services/adminBooksService";

/** Controlled-input form state — numeric fields are kept as strings. */
interface AdminBookForm {
	title: string;
	titleEn: string;
	author: string;
	authorEn: string;
	genre: string;
	genreEn: string;
	description: string;
	descriptionEn: string;
	price: string;
	pages: string;
	publishedYear: string;
	stock: string;
}

const EMPTY_FORM: AdminBookForm = {
	title: "",
	titleEn: "",
	author: "",
	authorEn: "",
	genre: "",
	genreEn: "",
	description: "",
	descriptionEn: "",
	price: "",
	pages: "",
	publishedYear: "",
	stock: "",
};

/** Bilingual field pairs — a filled UK side requires its EN side, and vice versa. */
const BILINGUAL_PAIRS: Array<[keyof AdminBookForm, keyof AdminBookForm]> = [
	["title", "titleEn"],
	["author", "authorEn"],
	["genre", "genreEn"],
	["description", "descriptionEn"],
];

export interface UseAdminBooksPageResult {
	books: AdminBook[];
	loading: boolean;
	listError: string | null;
	editingId: number | null;
	form: AdminBookForm;
	fieldErrors: Record<string, string>;
	formError: string | null;
	successMessage: string | null;
	saving: boolean;
	coverPreviewUrl: string | null;
	removeCoverImage: boolean;
	startCreate: () => void;
	startEdit: (book: AdminBook) => void;
	cancelEdit: () => void;
	handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	handleCoverChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleRemoveCover: () => void;
	handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
	handleDelete: (id: number) => Promise<void>;
}

export function useAdminBooksPage(): UseAdminBooksPageResult {
	const {t} = useLocale();

	const [books, setBooks] = useState<AdminBook[]>([]);
	const [loading, setLoading] = useState(true);
	const [listError, setListError] = useState<string | null>(null);

	const [editingId, setEditingId] = useState<number | null>(null);
	const [form, setForm] = useState<AdminBookForm>(EMPTY_FORM);
	const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
	const [formError, setFormError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);

	const [coverFile, setCoverFile] = useState<File | null>(null);
	const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
	const [removeCoverImage, setRemoveCoverImage] = useState(false);

	const loadBooks = useCallback(async () => {
		setLoading(true);
		setListError(null);
		try {
			const data = await adminBooksService.getAll();
			setBooks(data);
		} catch (err) {
			setListError(err instanceof Error ? err.message : String(err));
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		void loadBooks();
	}, [loadBooks]);

	// Revoke any object URL we created for a locally-picked cover file so it
	// doesn't leak once the form resets or a different file is chosen.
	useEffect(() => {
		return () => {
			if (coverPreviewUrl && coverFile) URL.revokeObjectURL(coverPreviewUrl);
		};
	}, [coverPreviewUrl, coverFile]);

	const resetFormState = (): void => {
		setForm(EMPTY_FORM);
		setFieldErrors({});
		setFormError(null);
		setCoverFile(null);
		setCoverPreviewUrl(null);
		setRemoveCoverImage(false);
	};

	const startCreate = (): void => {
		setEditingId(0); // 0 = "creating" sentinel, distinct from null ("form closed")
		resetFormState();
	};

	const startEdit = (book: AdminBook): void => {
		setEditingId(book.id);
		setForm({
			title: book.title,
			titleEn: book.titleEn,
			author: book.author,
			authorEn: book.authorEn,
			genre: book.genre,
			genreEn: book.genreEn,
			description: book.description,
			descriptionEn: book.descriptionEn,
			price: String(book.price),
			pages: book.pages !== undefined ? String(book.pages) : "",
			publishedYear:
				book.publishedYear !== undefined ? String(book.publishedYear) : "",
			stock: String(book.stock),
		});
		setFieldErrors({});
		setFormError(null);
		setCoverFile(null);
		setCoverPreviewUrl(book.coverImageUrl ?? null);
		setRemoveCoverImage(false);
	};

	const cancelEdit = (): void => {
		setEditingId(null);
		resetFormState();
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	): void => {
		const {name, value} = e.target;
		setForm((prev) => ({...prev, [name]: value}));
		setFieldErrors((prev) => {
			if (!prev[name]) return prev;
			const next = {...prev};
			delete next[name];
			return next;
		});
	};

	const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const file = e.target.files?.[0] ?? null;
		if (coverPreviewUrl && coverFile) URL.revokeObjectURL(coverPreviewUrl);
		setCoverFile(file);
		setCoverPreviewUrl(file ? URL.createObjectURL(file) : null);
		setRemoveCoverImage(false);
	};

	const handleRemoveCover = (): void => {
		if (coverPreviewUrl && coverFile) URL.revokeObjectURL(coverPreviewUrl);
		setCoverFile(null);
		setCoverPreviewUrl(null);
		setRemoveCoverImage(true);
	};

	/**
	 * Validates the form: required UK fields, required numeric fields, and
	 * the "filled UK ⇒ also fill EN" rule for the four bilingual pairs.
	 * Returns the error map (empty = valid) and also stores it in state.
	 */
	const runValidation = (): Record<string, string> => {
		const errors: Record<string, string> = {};

		if (!form.title.trim()) errors["title"] = t.admin.requiredField;
		if (!form.author.trim()) errors["author"] = t.admin.requiredField;
		if (!form.genre.trim()) errors["genre"] = t.admin.requiredField;

		for (const [ukKey, enKey] of BILINGUAL_PAIRS) {
			const ukValue = form[ukKey].trim();
			const enValue = form[enKey].trim();
			if (ukValue && !enValue) {
				errors[enKey] = t.admin.needEnglishToo;
			}
		}

		if (form.price.trim() === "" || Number.isNaN(Number(form.price))) {
			errors["price"] = t.admin.invalidNumber;
		}
		if (form.stock.trim() === "" || Number.isNaN(Number(form.stock))) {
			errors["stock"] = t.admin.invalidNumber;
		}
		if (form.pages.trim() !== "" && Number.isNaN(Number(form.pages))) {
			errors["pages"] = t.admin.invalidNumber;
		}
		if (
			form.publishedYear.trim() !== "" &&
			Number.isNaN(Number(form.publishedYear))
		) {
			errors["publishedYear"] = t.admin.invalidNumber;
		}

		setFieldErrors(errors);
		return errors;
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();
		setFormError(null);
		setSuccessMessage(null);

		const errors = runValidation();
		if (Object.keys(errors).length > 0) return;

		const input: AdminBookInput = {
			title: form.title.trim(),
			titleEn: form.titleEn.trim(),
			author: form.author.trim(),
			authorEn: form.authorEn.trim(),
			genre: form.genre.trim(),
			genreEn: form.genreEn.trim(),
			description: form.description.trim(),
			descriptionEn: form.descriptionEn.trim(),
			price: Number(form.price),
			stock: Number(form.stock),
			pages: form.pages.trim() !== "" ? Number(form.pages) : undefined,
			publishedYear:
				form.publishedYear.trim() !== "" ? Number(form.publishedYear) : undefined,
			coverImageFile: coverFile,
			removeCoverImage,
		};

		setSaving(true);
		try {
			if (editingId) {
				const updated = await adminBooksService.update(editingId, input);
				setBooks((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
			} else {
				const created = await adminBooksService.create(input);
				setBooks((prev) => [...prev, created]);
			}
			setSuccessMessage(t.admin.saveSuccess);
			setEditingId(null);
			resetFormState();
		} catch (err) {
			setFormError(err instanceof Error ? err.message : String(err));
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async (id: number): Promise<void> => {
		setListError(null);
		try {
			await adminBooksService.remove(id);
			setBooks((prev) => prev.filter((b) => b.id !== id));
			setSuccessMessage(t.admin.deleteSuccess);
			if (editingId === id) cancelEdit();
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			setListError(message === "book_has_orders" ? t.admin.bookHasOrders : message);
		}
	};

	return {
		books,
		loading,
		listError,
		editingId,
		form,
		fieldErrors,
		formError,
		successMessage,
		saving,
		coverPreviewUrl,
		removeCoverImage,
		startCreate,
		startEdit,
		cancelEdit,
		handleChange,
		handleCoverChange,
		handleRemoveCover,
		handleSubmit,
		handleDelete,
	};
}

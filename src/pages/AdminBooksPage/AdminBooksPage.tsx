/**
 * Catalog administration panel — the "Add book" tab shown only to
 * `user.role === 'admin'` (gated by <AdminRoute> in App.tsx).
 *
 * Styled to match the rest of the account area: card layout from
 * ProfilePage, inputs/buttons from forms/shared/forms.module.css.
 * The form is bilingual (uk/en side by side) because the Rails admin
 * endpoint (`Book#validates ..._en, presence: true, on: :admin_write`)
 * rejects a save unless every English field is filled in too — see
 * useAdminBooksPage's `runValidation`, which surfaces that as an inline
 * "fill in English too" message right under the empty EN field instead
 * of waiting for the API round-trip to reject it.
 */
import {
	Plus,
	Pencil,
	Trash2,
	ImagePlus,
	ImageOff,
	Loader2,
	BookImage,
} from "lucide-react";
import {useLocale} from "../../i18n/LocaleContext";
import {useAdminBooksPage} from "../../hooks/useAdminBooksPage";
import {BOOK_COVER_PLACEHOLDER} from "../../constants/bookPlaceholder";
import {FormInput} from "../../forms/shared/FormInput";
import {Toast} from "../../components/Toast/Toast";
import {Spinner} from "../../components/ui/Spinner";
import formStyles from "../../forms/shared/forms.module.css";
import styles from "./AdminBooksPage.module.css";

export function AdminBooksPage(): React.ReactElement {
	const {t} = useLocale();
	const {
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
		startCreate,
		startEdit,
		cancelEdit,
		handleChange,
		handleCoverChange,
		handleRemoveCover,
		handleSubmit,
		handleDelete,
	} = useAdminBooksPage();

	const isEditing = editingId !== null;

	return (
		<>
			{successMessage && <Toast message={successMessage} onClose={() => {}} />}
			{listError && (
				<Toast message={listError} variant="error" onClose={() => {}} />
			)}

			<div className={styles.card}>
				<div className={styles.headingRow}>
					<div>
						<h1 className={styles.heading}>{t.admin.heading}</h1>
						<p className={styles.subheading}>{t.admin.subheading}</p>
					</div>
					{!isEditing && (
						<button
							type="button"
							className={styles.addBtn}
							onClick={startCreate}
						>
							<Plus size={16} aria-hidden="true" />
							{t.admin.addBookTab}
						</button>
					)}
				</div>

				{loading ? (
					<Spinner size={28} label={t.admin.loading} />
				) : books.length === 0 && !isEditing ? (
					<p className={styles.emptyState}>{t.admin.emptyList}</p>
				) : (
					!isEditing && (
						<div className={styles.list}>
							{books.map((book) => (
								<div className={styles.row} key={book.id}>
									{book.coverImageUrl ? (
										<img
											src={book.coverImageUrl}
											alt=""
											className={styles.thumb}
										/>
									) : (
										<div className={styles.thumbPlaceholder}>
											<BookImage size={18} aria-hidden="true" />
										</div>
									)}
									<div className={styles.rowInfo}>
										<p className={styles.rowTitle}>
											{book.title}
											{book.titleEn ? ` / ${book.titleEn}` : ""}
										</p>
										<p className={styles.rowMeta}>
											{book.author} · {book.price} ₴ ·{" "}
											{t.admin.fields.stock}: {book.stock}
										</p>
									</div>
									<div className={styles.rowActions}>
										<button
											type="button"
											className={styles.iconBtn}
											aria-label={t.admin.editBtn}
											onClick={() => startEdit(book)}
										>
											<Pencil size={15} aria-hidden="true" />
										</button>
										<button
											type="button"
											className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
											aria-label={t.admin.deleteBtn}
											onClick={() => {
												if (
													window.confirm(t.admin.deleteConfirm)
												) {
													void handleDelete(book.id);
												}
											}}
										>
											<Trash2 size={15} aria-hidden="true" />
										</button>
									</div>
								</div>
							))}
						</div>
					)
				)}
			</div>

			{isEditing && (
				<div className={styles.card}>
					<h2 className={styles.heading}>
						{editingId ? t.admin.editBookTitle : t.admin.newBookTitle}
					</h2>

					<form onSubmit={(e) => void handleSubmit(e)} noValidate>
						{formError && (
							<p className={formStyles.formError} role="alert">
								{formError}
							</p>
						)}

						{/* ── Cover ──────────────────────────────────────── */}
						<div className={styles.coverRow}>
							{coverPreviewUrl ? (
								<img
									src={coverPreviewUrl}
									alt=""
									className={styles.coverPreview}
								/>
							) : (
								<div className={styles.coverPlaceholder}>
									<img
										src={BOOK_COVER_PLACEHOLDER}
										alt=""
										className={styles.coverPlaceholderImg}
									/>
									<span>{t.admin.coverPlaceholderHint}</span>
								</div>
							)}
							<div className={styles.coverControls}>
								<div className={styles.coverBtnRow}>
									<label className={styles.uploadBtn}>
										<ImagePlus size={14} aria-hidden="true" />
										{coverPreviewUrl
											? t.admin.coverReplace
											: t.admin.coverUpload}
										<input
											type="file"
											accept="image/*"
											className={styles.hiddenFileInput}
											onChange={handleCoverChange}
										/>
									</label>
									{coverPreviewUrl && (
										<button
											type="button"
											className={styles.removeCoverBtn}
											onClick={handleRemoveCover}
										>
											<ImageOff size={14} aria-hidden="true" />
											{t.admin.coverRemove}
										</button>
									)}
								</div>
							</div>
						</div>

						{/* ── Bilingual fields ───────────────────────────── */}
						<p className={styles.sectionLabel}>{t.admin.ukSection}</p>
						<div className={styles.langGrid}>
							<FormInput
								name="title"
								label={t.admin.fields.title}
								value={form.title}
								onChange={handleChange}
								error={fieldErrors["title"]}
							/>
							<FormInput
								name="titleEn"
								label={`${t.admin.fields.title} (EN)`}
								value={form.titleEn}
								onChange={handleChange}
								error={fieldErrors["titleEn"]}
							/>
							<FormInput
								name="author"
								label={t.admin.fields.author}
								value={form.author}
								onChange={handleChange}
								error={fieldErrors["author"]}
							/>
							<FormInput
								name="authorEn"
								label={`${t.admin.fields.author} (EN)`}
								value={form.authorEn}
								onChange={handleChange}
								error={fieldErrors["authorEn"]}
							/>
							<FormInput
								name="genre"
								label={t.admin.fields.genre}
								value={form.genre}
								onChange={handleChange}
								error={fieldErrors["genre"]}
							/>
							<FormInput
								name="genreEn"
								label={`${t.admin.fields.genre} (EN)`}
								value={form.genreEn}
								onChange={handleChange}
								error={fieldErrors["genreEn"]}
							/>
						</div>

						<div className={styles.langGrid}>
							<div className={formStyles.field}>
								<label className={formStyles.label} htmlFor="description">
									{t.admin.fields.description}
								</label>
								<textarea
									id="description"
									name="description"
									className={styles.textarea}
									value={form.description}
									onChange={handleChange}
								/>
							</div>
							<div className={formStyles.field}>
								<label
									className={formStyles.label}
									htmlFor="descriptionEn"
								>
									{t.admin.fields.description} (EN)
								</label>
								<textarea
									id="descriptionEn"
									name="descriptionEn"
									className={styles.textarea}
									value={form.descriptionEn}
									onChange={handleChange}
								/>
								{fieldErrors["descriptionEn"] && (
									<span role="alert" className={formStyles.errorMsg}>
										{fieldErrors["descriptionEn"]}
									</span>
								)}
							</div>
						</div>

						{/* ── Numbers ────────────────────────────────────── */}
						<p className={styles.sectionLabel}>{t.admin.fields.price}</p>
						<div className={styles.numberGrid}>
							<FormInput
								name="price"
								type="number"
								label={t.admin.fields.price}
								value={form.price}
								onChange={handleChange}
								error={fieldErrors["price"]}
								min={0}
								step="0.01"
							/>
							<FormInput
								name="stock"
								type="number"
								label={t.admin.fields.stock}
								value={form.stock}
								onChange={handleChange}
								error={fieldErrors["stock"]}
								min={0}
							/>
							<FormInput
								name="pages"
								type="number"
								label={t.admin.fields.pages}
								value={form.pages}
								onChange={handleChange}
								error={fieldErrors["pages"]}
								min={0}
							/>
							<FormInput
								name="publishedYear"
								type="number"
								label={t.admin.fields.publishedYear}
								value={form.publishedYear}
								onChange={handleChange}
								error={fieldErrors["publishedYear"]}
							/>
						</div>

						<div className={styles.formActions}>
							<button
								type="submit"
								className={formStyles.submitBtn}
								disabled={saving}
								aria-busy={saving}
							>
								{saving ? (
									<Loader2
										size={16}
										className={formStyles.spinner}
										aria-hidden="true"
									/>
								) : (
									<Plus size={16} aria-hidden="true" />
								)}
								{saving
									? t.admin.saving
									: editingId
										? t.admin.submitUpdate
										: t.admin.submitCreate}
							</button>
							<button
								type="button"
								className={styles.cancelBtn}
								onClick={cancelEdit}
							>
								{t.admin.cancel}
							</button>
						</div>
					</form>
				</div>
			)}
		</>
	);
}

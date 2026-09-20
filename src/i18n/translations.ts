/**
 * @module i18n/translations
 *
 * Application translation dictionaries.
 * Both languages must always contain the same set of keys — TypeScript will
 * flag a missing key as a type error because `uk` is typed as `typeof en`.
 */

export const en = {
	// ─── Shared / generic ───────────────────────────────────────────────────────
	common: {
		serverErrorTitle: "Something went sideways",
		serverErrorBody:
			"We couldn't reach the server. It might just be waking up — try again in a moment.",
		retry: "Try again",
		retrying: "Retrying…",
	},

	// ─── Navigation ─────────────────────────────────────────────────────────────
	nav: {
		home: "Catalog",
		search: "Search",
		profile: "Profile",
		login: "Sign In",
		register: "Sign Up",
		logoAlt: "BookNest — go to home",
		mainNav: "Main navigation",
	},

	// ─── Home page ───────────────────────────────────────────────────────────────
	home: {
		heading: "BookNest Catalog",
		loading: "Loading books…",
		searchPlaceholder: "Search books…",
		searchLabel: "Search by headline or description",
		authorLabel: "Filter by author",
		dateLabel: "Filter by publication year",
		clearFilters: "Clear",
		genreNav: "Filter by genre",
		allGenres: "All",
		found: "Found:",
		books: "books",
		empty: "No books found. Try a different query.",
		error: "Error: ",
		loadError: "Could not load books.",
	},

	// ─── Search page ─────────────────────────────────────────────────────────────
	search: {
		inputPlaceholder: "Search books…",
		inputLabel: "Search",
		authorLabel: "Filter by author",
		resetFilters: "Reset",
		foundOf: (count: number, total: number) => `Found: ${count} of ${total}`,
		noResults: "Nothing found. Try a different query.",
	},

	// ─── Sort control ─────────────────────────────────────────────────────────────
	sort: {
		newestFirst: "Newest first",
		oldestFirst: "Oldest first",
		ariaNewest: "Sort from oldest to newest",
		ariaOldest: "Sort from newest to oldest",
	},

	// ─── Cart page ────────────────────────────────────────────────────────────────
	cart: {
		heading: "Your cart",
		loading: "Loading cart…",
		empty: "Your cart is empty.",
		decreaseAria: "Decrease quantity",
		increaseAria: "Increase quantity",
		removeAria: (title: string) => `Remove ${title} from cart`,
		total: "Total",
		checkoutBtn: "Place order",
		placingOrder: "Placing order…",
		checkoutError: "Could not place the order. Please try again.",
	},

	// ─── Orders page ──────────────────────────────────────────────────────────────
	orders: {
		heading: "My orders",
		loading: "Loading orders…",
		empty: "You have not placed any orders yet.",
		browseLink: "Browse the catalog",
		number: "Order",
		items: "items",
		detailsBtn: "Details",
		backToOrders: "← Back to orders",
		notFound: "Order not found.",
	},

	// ─── Book card ────────────────────────────────────────────────────────────────
	card: {
		save: "Save",
		saved: "Saved",
		remove: "Remove",
		readMore: "Read more",
		saveAriaLabel: "Save book",
		removeAriaLabel: "Remove from saved",
		addToCart: "Add to cart",
		addedToCart: "Added",
		outOfStock: "Out of stock",
		addToCartAriaLabel: (title: string) => `Add "${title}" to cart`,
	},

	// ─── Book detail page ─────────────────────────────────────────────────────────
	detail: {
		loading: "Loading…",
		notFound: "Book not found",
		loadError: "Failed to load book.",
		back: "BACK",
		save: "SAVE",
		saved: "SAVED",
	},

	// ─── Profile page ─────────────────────────────────────────────────────────────
	profile: {
		heading: "Profile",
		editBtn: "Edit",
		logoutBtn: "Sign Out",
		infoLabel: "Profile information",
		savedHeading: (count: number) => `Saved books (${count})`,
		savedEmpty: "No saved books. Save interesting book with 🔖",
		removeBook: (title: string) => `Remove from saved: ${title}`,
		readBook: (title: string) => `Read book: ${title}`,
		toast: {
			nickname: "Nickname updated successfully",
			password: "Password updated successfully",
			both: "Nickname and password updated successfully",
		},
	},

	// ─── Edit profile form ────────────────────────────────────────────────────────
	editProfile: {
		formLabel: "Edit profile form",
		title: "Edit profile",
		nicknameLabel: "Nickname",
		passwordLabel: "New password (leave blank to keep current)",
		saveBtn: "Save",
		cancelBtn: "Cancel",
		placeholder: {
			nickname: "New nickname",
			password: "Leave blank to keep unchanged",
		},
	},

	// ─── Auth: login ─────────────────────────────────────────────────────────────
	login: {
		heading: "Sign In",
		emailLabel: "Email",
		passwordLabel: "Password",
		submitBtn: "Sign In",
		loadingBtn: "Loading…",
		forgotPasswordText: "Forgot password?",
		noAccountText: "No account yet?",
		noAccountLink: "Create account",
		resetSuccessMsg: "Password changed successfully! You can now sign in.",
	},

	// ─── Auth: register ───────────────────────────────────────────────────────────
	register: {
		heading: "Register",
		emailLabel: "Email",
		nicknameLabel: "Nickname (optional)",
		passwordLabel: "Password",
		submitBtn: "Create account",
		loadingBtn: "Loading…",
		hasAccountText: "Already have an account?",
		hasAccountLink: "Sign in",
	},

	// ─── Auth: forgot password ────────────────────────────────────────────────────
	forgotPassword: {
		heading: "Forgot password?",
		desc: "Enter your account email — we will send a reset code.",
		emailPlaceholder: "Your email",
		submitBtn: "Send code",
		loadingBtn: "Sending…",
		backToLogin: "Back to sign in",
		codeSentTitle: "Code sent",
		checkEmail: "Check your inbox",
		devCodeTitle: "Developer code",
		codeSentDesc: (email: string) =>
			`Code sent to ${email}. If you don't see it, check Spam.`,
		devCodeDesc:
			"EmailJS is not configured. Use this code for development (set VITE_EMAILJS_* in .env to send real emails):",
		codeValid: "Code valid for 15 minutes.",
		enterCode: "Enter code →",
		copyCode: "Copy code",
	},

	// ─── Auth: reset password ─────────────────────────────────────────────────────
	resetPassword: {
		heading: "New password",
		emailLabel: "Email",
		codeLabel: "Confirmation code",
		codePlaceholder: "6-digit code",
		newPasswordLabel: "New password",
		confirmLabel: "Confirm password",
		submitBtn: "Set password",
		loadingBtn: "Saving…",
		backToLogin: "Back to sign in",
	},

	// ─── Password strength ────────────────────────────────────────────────────────
	passwordStrength: {
		weak: "Weak",
		medium: "Medium",
		strong: "Strong",
		ariaLabel: (level: string) => `Password strength: ${level}`,
	},

	// ─── Shared form ─────────────────────────────────────────────────────────────
	form: {
		showPassword: "Show password",
		hidePassword: "Hide password",
		googleLogin: "Sign in with Google",
		orDivider: "or",
		closeNotice: "Close notification",
	},

	// ─── Validation messages ──────────────────────────────────────────────────────
	validation: {
		required: "Required field",
		invalidEmail: "Invalid email format",
		emailTooLong: "Email is too long",
		minNickname: "Minimum 2 characters",
		maxNickname: "Maximum 32 characters",
		minPassword: "Minimum 6 characters",
		latinOnly: "Latin characters only (English)",
		passwordUpper: "At least one uppercase letter required",
		passwordDigit: "At least one digit required",
		/** Per-rule labels shown inside PasswordStrengthHint checklist. */
		rules: {
			minLength: "Minimum 6 characters",
			latinOnly: "Latin characters only (English)",
			upperCase: "At least one uppercase letter",
			digit: "At least one digit",
		},
	},

	// ─── Layout / footer ─────────────────────────────────────────────────────────
	layout: {
		footerTitle: "© 2026 BOOKNEST",
		footerSub: "Kalush, Ivano-Frankivsk region • Online bookstore",
		city: "Kalush",
	},

	// ─── Book layout ───────────────────────────────────────────────────────────
	book: {
		back: "BACK",
	},

	// ─── Admin — "Add book" panel (visible only to user.role === 'admin') ────────
	admin: {
		navLink: "Add book",
		heading: "Catalog administration",
		subheading: "Add, edit or remove books from the BookNest catalog.",
		addBookTab: "Add book",
		listTab: "All books",
		newBookTitle: "New book",
		editBookTitle: "Edit book",
		ukSection: "Ukrainian",
		enSection: "English",
		fields: {
			title: "Title",
			author: "Author",
			genre: "Genre",
			description: "Description",
			price: "Price, ₴",
			pages: "Pages",
			publishedYear: "Publication year",
			stock: "In stock",
		},
		cover: "Cover",
		coverUpload: "Upload cover",
		coverReplace: "Replace cover",
		coverRemove: "Remove cover",
		coverPlaceholderHint: "No cover — a placeholder will be shown",
		submitCreate: "Add book",
		submitUpdate: "Save changes",
		cancel: "Cancel",
		editBtn: "Edit",
		deleteBtn: "Delete",
		deleteConfirm: "Delete this book? This can't be undone.",
		emptyList: "The catalog is empty — add the first book.",
		loading: "Loading…",
		saving: "Saving…",
		saveSuccess: "Book saved.",
		deleteSuccess: "Book deleted.",
		needEnglishToo:
			"Fill in the English version too — the catalog needs both languages.",
		requiredField: "Required field",
		invalidNumber: "Enter a valid number",
		bookHasOrders:
			"Can't delete — this book already has orders. Remove it from stock instead (set stock to 0).",
	},

	// ─── Auth service errors ──────────────────────────────────────────────────────
	auth: {
		fill_all_fields: "Please fill in all fields!",
		user_not_found: "User not found!",
		user_data_error: "User data error.",
		wrong_password: "Incorrect password!",
		internal_error: "Internal error. Please try again.",
		email_password_required: "Email and password are required!",
		email_taken: "This email is already registered!",
		user_not_found_update: "User not found.",
		update_data_error: "Data error.",
		not_authorized: "Not authorized.",
		invalid_email_auth: "Invalid email.",
		account_not_found: "No account found with this email.",
		code_not_found: "Code not found. Please request a new one.",
		invalid_code: "Invalid code.",
		code_expired: "Code expired. Please request a new one.",
		invalid_input: "Invalid input.",
		tooManyAttempts: (minutes: number) =>
			`Too many attempts. Try again in ${minutes} min.`,
		// Codes returned by the real Spring Boot auth-service (apiAuth) —
		// distinct from the mock-mode codes above.
		invalid_credentials: "Incorrect email or password.",
		email_already_registered: "This email is already registered!",
		invalid_or_expired_code: "Invalid or expired code.",
		invalid_refresh_token: "Your session has expired. Please log in again.",
		no_refresh_token: "You're not logged in.",
		not_authenticated: "You're not logged in.",
		network_error:
			"Can't reach the server right now. Check your connection and try again.",
	},

	// ─── 404 page ────────────────────────────────────────────────────────────────
	notFound: {
		title: "Page not found",
		subtitle: "This shelf is empty — there's no page at that address.",
		homeLink: "Back to the catalog",
	},
};

/** Ukrainian translation — must mirror the shape of `en`. */
export const uk: typeof en = {
	common: {
		serverErrorTitle: "Щось пішло не так",
		serverErrorBody:
			"Не вдалося достукатись до сервера. Можливо, він ще прокидається — спробуй ще раз за хвильку.",
		retry: "Спробувати ще раз",
		retrying: "Пробуємо ще раз…",
	},
	nav: {
		home: "Каталог",
		search: "Пошук",
		profile: "Профіль",
		login: "Увійти",
		register: "Реєстрація",
		logoAlt: "BookNest — повернутись на головну",
		mainNav: "Основна навігація",
	},
	home: {
		heading: "Каталог книг",
		loading: "Завантаження книг…",
		searchPlaceholder: "Пошук книг…",
		searchLabel: "Пошук за заголовком або описом",
		authorLabel: "Фільтр за автором",
		dateLabel: "Фільтр за роком видання",
		clearFilters: "Очистити",
		genreNav: "Фільтр за категоріями",
		allGenres: "Всі",
		found: "Знайдено:",
		books: "книг",
		empty: "Книг не знайдено. Спробуйте інший запит.",
		error: "Помилка: ",
		loadError: "Не вдалося завантажити книги.",
	},
	search: {
		inputPlaceholder: "Пошук книг…",
		inputLabel: "Пошук",
		authorLabel: "Фільтр за автором",
		resetFilters: "Скинути",
		foundOf: (count: number, total: number) => `Знайдено: ${count} з ${total}`,
		noResults: "Нічого не знайдено. Спробуй інший запит.",
	},
	sort: {
		newestFirst: "Нові спочатку",
		oldestFirst: "Старі спочатку",
		ariaNewest: "Сортувати від старих до нових",
		ariaOldest: "Сортувати від нових до старих",
	},
	cart: {
		heading: "Кошик",
		loading: "Завантаження кошика…",
		empty: "Кошик порожній.",
		decreaseAria: "Зменшити кількість",
		increaseAria: "Збільшити кількість",
		removeAria: (title: string) => `Видалити «${title}» з кошика`,
		total: "Разом",
		checkoutBtn: "Оформити замовлення",
		placingOrder: "Оформлюємо…",
		checkoutError: "Не вдалося оформити замовлення. Спробуйте ще раз.",
	},
	orders: {
		heading: "Мої замовлення",
		loading: "Завантаження замовлень…",
		empty: "Ви ще не робили замовлень.",
		browseLink: "Перейти до каталогу",
		number: "Замовлення",
		items: "товарів",
		detailsBtn: "Деталі",
		backToOrders: "← До списку замовлень",
		notFound: "Замовлення не знайдено.",
	},

	card: {
		save: "Зберегти",
		saved: "Збережено",
		remove: "Видалити",
		readMore: "Читати далі",
		saveAriaLabel: "Зберегти книгу",
		removeAriaLabel: "Видалити зі збережених",
		addToCart: "У кошик",
		addedToCart: "Додано",
		outOfStock: "Немає в наявності",
		addToCartAriaLabel: (title: string) => `Додати «${title}» до кошика`,
	},
	detail: {
		loading: "Завантаження…",
		notFound: "Книгу не знайдено",
		loadError: "Не вдалося завантажити книгу.",
		back: "НАЗАД",
		save: "ЗБЕРЕГТИ",
		saved: "ЗБЕРЕЖЕНО",
	},
	profile: {
		heading: "Профіль",
		editBtn: "Редагувати",
		logoutBtn: "Вийти",
		infoLabel: "Інформація про профіль",
		savedHeading: (count: number) => `Збережені книги (${count})`,
		savedEmpty: "Збережених книг ще немає. Знайдіть цікаву книгу та натисніть 🔖",
		removeBook: (title: string) => `Видалити зі збережених: ${title}`,
		readBook: (title: string) => `Переглянути книгу: ${title}`,
		toast: {
			nickname: "Нікнейм успішно змінено",
			password: "Пароль успішно змінено",
			both: "Нікнейм та пароль успішно змінено",
		},
	},
	editProfile: {
		formLabel: "Форма редагування профілю",
		title: "Редагування профілю",
		nicknameLabel: "Нікнейм",
		passwordLabel: "Новий пароль (залиш порожнім, щоб не змінювати)",
		saveBtn: "Зберегти",
		cancelBtn: "Скасувати",
		placeholder: {
			nickname: "Новий нікнейм",
			password: "Залиш порожнім, щоб не змінювати",
		},
	},
	login: {
		heading: "Вхід",
		emailLabel: "Email",
		passwordLabel: "Пароль",
		submitBtn: "Увійти",
		loadingBtn: "Завантаження…",
		forgotPasswordText: "Забули пароль?",
		noAccountText: "Ще немає акаунту?",
		noAccountLink: "Створити акаунт",
		resetSuccessMsg: "Пароль успішно змінено! Тепер ви можете увійти.",
	},
	register: {
		heading: "Реєстрація",
		emailLabel: "Email",
		nicknameLabel: "Нікнейм (необов'язково)",
		passwordLabel: "Пароль",
		submitBtn: "Зареєструватись",
		loadingBtn: "Завантаження…",
		hasAccountText: "Вже є акаунт?",
		hasAccountLink: "Увійти",
	},
	forgotPassword: {
		heading: "Забули пароль?",
		desc: "Введіть email вашого акаунту — ми надішлемо код для скидання пароля.",
		emailPlaceholder: "Ваш email",
		submitBtn: "Надіслати код",
		loadingBtn: "Надсилаємо…",
		backToLogin: "Назад до входу",
		codeSentTitle: "Код надіслано",
		checkEmail: "Перевірте пошту",
		devCodeTitle: "Код для розробника",
		codeSentDesc: (email: string) =>
			`Код надіслано на ${email}. Якщо листа немає — перевірте папку «Спам».`,
		devCodeDesc:
			"EmailJS не налаштований. Використай цей код для розробки (налаштуй VITE_EMAILJS_* у .env, щоб надсилати справжні листи):",
		codeValid: "Код дійсний 15 хвилин.",
		enterCode: "Ввести код →",
		copyCode: "Скопіювати код",
	},
	resetPassword: {
		heading: "Новий пароль",
		emailLabel: "Email",
		codeLabel: "Код підтвердження",
		codePlaceholder: "6-значний код",
		newPasswordLabel: "Новий пароль",
		confirmLabel: "Підтвердити пароль",
		submitBtn: "Встановити пароль",
		loadingBtn: "Збереження…",
		backToLogin: "Назад до входу",
	},
	passwordStrength: {
		weak: "Слабкий",
		medium: "Середній",
		strong: "Надійний",
		ariaLabel: (level: string) => `Надійність пароля: ${level}`,
	},
	form: {
		showPassword: "Показати пароль",
		hidePassword: "Приховати пароль",
		googleLogin: "Увійти через Google",
		orDivider: "або",
		closeNotice: "Закрити повідомлення",
	},
	validation: {
		required: "Обов'язкове поле",
		invalidEmail: "Невірний формат email",
		emailTooLong: "Email занадто довгий",
		minNickname: "Мінімум 2 символи",
		maxNickname: "Максимум 32 символи",
		minPassword: "Мінімум 6 символів",
		latinOnly: "Лише латинські символи (англійська)",
		passwordUpper: "Потрібна хоча б одна велика літера",
		passwordDigit: "Потрібна хоча б одна цифра",
		rules: {
			minLength: "Мінімум 6 символів",
			latinOnly: "Лише латинські символи (англ)",
			upperCase: "Хоча б одна велика літера",
			digit: "Хоча б одна цифра",
		},
	},
	layout: {
		footerTitle: "© 2026 BOOKNEST",
		footerSub: "Калуш, Івано-Франківська обл. • Книгарня онлайн",
		city: "Калуш",
	},
	book: {
		back: "НАЗАД",
	},

	admin: {
		navLink: "Додати книгу",
		heading: "Керування каталогом",
		subheading: "Додавання, редагування та видалення книг каталогу BookNest.",
		addBookTab: "Додати книгу",
		listTab: "Усі книги",
		newBookTitle: "Нова книга",
		editBookTitle: "Редагування книги",
		ukSection: "Українською",
		enSection: "Англійською",
		fields: {
			title: "Назва",
			author: "Автор",
			genre: "Жанр",
			description: "Опис",
			price: "Ціна, ₴",
			pages: "Сторінок",
			publishedYear: "Рік видання",
			stock: "На складі",
		},
		cover: "Обкладинка",
		coverUpload: "Завантажити обкладинку",
		coverReplace: "Змінити обкладинку",
		coverRemove: "Прибрати обкладинку",
		coverPlaceholderHint: "Без обкладинки — буде показано плейсхолдер",
		submitCreate: "Додати книгу",
		submitUpdate: "Зберегти зміни",
		cancel: "Скасувати",
		editBtn: "Редагувати",
		deleteBtn: "Видалити",
		deleteConfirm: "Видалити цю книгу? Дію не можна скасувати.",
		emptyList: "Каталог порожній — додайте першу книгу.",
		loading: "Завантаження…",
		saving: "Збереження…",
		saveSuccess: "Книгу збережено.",
		deleteSuccess: "Книгу видалено.",
		needEnglishToo: "Заповніть і англійську версію — каталог має бути двомовним.",
		requiredField: "Обов'язкове поле",
		invalidNumber: "Введіть коректне число",
		bookHasOrders:
			"Не можна видалити — на цю книгу вже є замовлення. Приберіть її з наявності (встановіть 0 на складі).",
	},

	auth: {
		fill_all_fields: "Будь ласка, заповніть усі поля!",
		user_not_found: "Користувача не існує!",
		user_data_error: "Помилка даних користувача.",
		wrong_password: "Невірний пароль!",
		internal_error: "Внутрішня помилка. Спробуйте ще раз.",
		email_password_required: "Email та пароль є обов'язковими!",
		email_taken: "Цей email вже зайнятий!",
		user_not_found_update: "Користувача не знайдено.",
		update_data_error: "Помилка даних.",
		not_authorized: "Не авторизовано.",
		invalid_email_auth: "Невірний email.",
		invalid_credentials: "Невірний email або пароль.",
		email_already_registered: "Цей email вже зареєстровано!",
		invalid_or_expired_code: "Невірний або прострочений код.",
		invalid_refresh_token: "Сесія завершилась. Увійдіть ще раз.",
		no_refresh_token: "Ви не увійшли в систему.",
		not_authenticated: "Ви не увійшли в систему.",
		network_error:
			"Не вдалося з'єднатися із сервером. Перевірте з'єднання і спробуйте ще раз.",
		account_not_found: "Акаунт з таким email не знайдено.",
		code_not_found: "Код не знайдено. Запросіть новий.",
		invalid_code: "Невірний код.",
		code_expired: "Код прострочено. Запросіть новий.",
		invalid_input: "Некоректні дані.",
		tooManyAttempts: (minutes: number) =>
			`Забагато спроб. Спробуйте через ${minutes} хв.`,
	},

	notFound: {
		title: "Сторінку не знайдено",
		subtitle: "Ця полиця порожня — за такою адресою нічого немає.",
		homeLink: "Повернутись до каталогу",
	},
};

/** All supported locale codes. */
export type Locale = "en" | "uk";

/** Map of locale → translation dictionary. */
export const TRANSLATIONS: Record<Locale, typeof en> = {en, uk};

/** The localStorage key used to persist the user's language choice. */
export const LOCALE_STORAGE_KEY = "booknest_locale";

/** Default locale used when nothing is stored. */
export const DEFAULT_LOCALE: Locale = "uk";

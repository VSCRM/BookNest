import {BooksArraySchema, type Book} from "../schemas";
import type {Locale} from "../i18n/translations";

// ─── Genres ───────────────────────────────────────────────────────────────

export const GENRES_UK = [
	"Всі",
	"Поезія",
	"Класика",
	"Роман",
	"Сучасна проза",
	"Історичний роман",
	"Фентезі",
	"Пригодницька література",
	"IT",
] as const;

export const GENRES_EN = [
	"All",
	"Poetry",
	"Classics",
	"Novel",
	"Contemporary fiction",
	"Historical fiction",
	"Fantasy",
	"Adventure",
	"IT",
] as const;

export const GENRES_BY_LOCALE: Record<Locale, readonly string[]> = {
	uk: GENRES_UK,
	en: GENRES_EN,
};

/** @deprecated Use GENRES_BY_LOCALE[locale] instead. */
export const GENRES: readonly string[] = GENRES_UK;

// ─── Sample catalog (bundled fallback data — used only when
// VITE_USE_MOCK=true, i.e. running the storefront without the Rails
// backend). Mirrors the same 32 titles as backend/db/seeds.rb (Harry
// Potter x7, Percy Jackson x5, The Hobbit + LOTR x3, The Witcher x7,
// Twilight, Джури козака Швайки x3, Howl's Moving Castle x3, Clean Code,
// Design Patterns) so the demo experience is consistent whichever data
// source is active. ────────────────────────────────────────────────────

const RAW_UK = [
	{
		id: 1,
		title: "Гаррі Поттер і філософський камінь",
		author: "Джоан Роулінг",
		price: 320,
		genre: "Фентезі",
		pages: 320,
		publishedYear: 1997,
		stock: 20,
		description:
			"Перша книга саги: хлопець дізнається, що він чарівник, і вирушає до Гоґвортсу.",
		coverImageUrl:
			"https://placehold.co/400x600/EBD9B4/3A2F28?text=%D0%93%D0%B0%D1%80%D1%80%D1%96%20%D0%9F%D0%BE%D1%82%D1%82%D0%B5%D1%80%20%D1%96%20%D1%84%D1%96%D0%BB%D0%BE%D1%81%D0%BE%D1%84%D1%81%D1%8C%D0%BA%D0%B8%D0%B9%20%D0%BA%D0%B0%D0%BC%D1%96%D0%BD%D1%8C",
	},
	{
		id: 2,
		title: "Гаррі Поттер і таємна кімната",
		author: "Джоан Роулінг",
		price: 320,
		genre: "Фентезі",
		pages: 336,
		publishedYear: 1998,
		stock: 18,
		description: "Другий рік у Гоґвортсі: хтось відкрив Таємну кімнату.",
		coverImageUrl:
			"https://placehold.co/400x600/EBD9B4/3A2F28?text=%D0%93%D0%B0%D1%80%D1%80%D1%96%20%D0%9F%D0%BE%D1%82%D1%82%D0%B5%D1%80%20%D1%96%20%D1%82%D0%B0%D1%94%D0%BC%D0%BD%D0%B0%20%D0%BA%D1%96%D0%BC%D0%BD%D0%B0%D1%82%D0%B0",
	},
	{
		id: 3,
		title: "Гаррі Поттер і в'язень Азкабану",
		author: "Джоан Роулінг",
		price: 330,
		genre: "Фентезі",
		pages: 448,
		publishedYear: 1999,
		stock: 16,
		description: "Третій рік: втеча небезпечного в'язня з Азкабану.",
		coverImageUrl:
			"https://placehold.co/400x600/EBD9B4/3A2F28?text=%D0%93%D0%B0%D1%80%D1%80%D1%96%20%D0%9F%D0%BE%D1%82%D1%82%D0%B5%D1%80%20%D1%96%20%D0%B2%27%D1%8F%D0%B7%D0%B5%D0%BD%D1%8C%20%D0%90%D0%B7%D0%BA%D0%B0%D0%B1%D0%B0%D0%BD%D1%83",
	},
	{
		id: 4,
		title: "Гаррі Поттер і келих вогню",
		author: "Джоан Роулінг",
		price: 360,
		genre: "Фентезі",
		pages: 640,
		publishedYear: 2000,
		stock: 14,
		description: "Турнір трьох чарівників і повернення темного лорда.",
		coverImageUrl:
			"https://placehold.co/400x600/EBD9B4/3A2F28?text=%D0%93%D0%B0%D1%80%D1%80%D1%96%20%D0%9F%D0%BE%D1%82%D1%82%D0%B5%D1%80%20%D1%96%20%D0%BA%D0%B5%D0%BB%D0%B8%D1%85%20%D0%B2%D0%BE%D0%B3%D0%BD%D1%8E",
	},
	{
		id: 5,
		title: "Гаррі Поттер і орден Фенікса",
		author: "Джоан Роулінг",
		price: 390,
		genre: "Фентезі",
		pages: 768,
		publishedYear: 2003,
		stock: 12,
		description: "П'ятий рік: таємне товариство протистоїть Міністерству магії.",
		coverImageUrl:
			"https://placehold.co/400x600/EBD9B4/3A2F28?text=%D0%93%D0%B0%D1%80%D1%80%D1%96%20%D0%9F%D0%BE%D1%82%D1%82%D0%B5%D1%80%20%D1%96%20%D0%BE%D1%80%D0%B4%D0%B5%D0%BD%20%D0%A4%D0%B5%D0%BD%D1%96%D0%BA%D1%81%D0%B0",
	},
	{
		id: 6,
		title: "Гаррі Поттер і напівкровний принц",
		author: "Джоан Роулінг",
		price: 370,
		genre: "Фентезі",
		pages: 608,
		publishedYear: 2005,
		stock: 12,
		description: "Шостий рік: минуле Волдеморта і таємничий підручник.",
		coverImageUrl:
			"https://placehold.co/400x600/EBD9B4/3A2F28?text=%D0%93%D0%B0%D1%80%D1%80%D1%96%20%D0%9F%D0%BE%D1%82%D1%82%D0%B5%D1%80%20%D1%96%20%D0%BD%D0%B0%D0%BF%D1%96%D0%B2%D0%BA%D1%80%D0%BE%D0%B2%D0%BD%D0%B8%D0%B9%20%D0%BF%D1%80%D0%B8%D0%BD%D1%86",
	},
	{
		id: 7,
		title: "Гаррі Поттер і смертельні реліквії",
		author: "Джоан Роулінг",
		price: 400,
		genre: "Фентезі",
		pages: 704,
		publishedYear: 2007,
		stock: 10,
		description: "Фінал саги: полювання на горокракси і остання битва.",
		coverImageUrl:
			"https://placehold.co/400x600/EBD9B4/3A2F28?text=%D0%93%D0%B0%D1%80%D1%80%D1%96%20%D0%9F%D0%BE%D1%82%D1%82%D0%B5%D1%80%20%D1%96%20%D1%81%D0%BC%D0%B5%D1%80%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D1%96%20%D1%80%D0%B5%D0%BB%D1%96%D0%BA%D0%B2%D1%96%D1%97",
	},
	{
		id: 8,
		title: "Персі Джексон і Викрадач блискавок",
		author: "Рік Ріордан",
		price: 280,
		genre: "Фентезі",
		pages: 375,
		publishedYear: 2005,
		stock: 15,
		description:
			"Підліток дізнається, що він син Посейдона, і вирушає рятувати світ богів.",
		coverImageUrl:
			"https://placehold.co/400x600/EBD9B4/3A2F28?text=%D0%9F%D0%B5%D1%80%D1%81%D1%96%20%D0%94%D0%B6%D0%B5%D0%BA%D1%81%D0%BE%D0%BD%20%D1%96%20%D0%92%D0%B8%D0%BA%D1%80%D0%B0%D0%B4%D0%B0%D1%87%20%D0%B1%D0%BB%D0%B8%D1%81%D0%BA%D0%B0%D0%B2%D0%BE%D0%BA",
	},
	{
		id: 9,
		title: "Персі Джексон і Море чудовиськ",
		author: "Рік Ріордан",
		price: 280,
		genre: "Фентезі",
		pages: 279,
		publishedYear: 2006,
		stock: 14,
		description: "Пошуки Золотого руна крізь Море чудовиськ (Бермудський трикутник).",
		coverImageUrl:
			"https://placehold.co/400x600/EBD9B4/3A2F28?text=%D0%9F%D0%B5%D1%80%D1%81%D1%96%20%D0%94%D0%B6%D0%B5%D0%BA%D1%81%D0%BE%D0%BD%20%D1%96%20%D0%9C%D0%BE%D1%80%D0%B5%20%D1%87%D1%83%D0%B4%D0%BE%D0%B2%D0%B8%D1%81%D1%8C%D0%BA",
	},
	{
		id: 10,
		title: "Персі Джексон і Прокляття титана",
		author: "Рік Ріордан",
		price: 290,
		genre: "Фентезі",
		pages: 312,
		publishedYear: 2007,
		stock: 13,
		description: "Артеміда зникає, а Персі вирушає у пошуки разом із новими друзями.",
		coverImageUrl:
			"https://placehold.co/400x600/EBD9B4/3A2F28?text=%D0%9F%D0%B5%D1%80%D1%81%D1%96%20%D0%94%D0%B6%D0%B5%D0%BA%D1%81%D0%BE%D0%BD%20%D1%96%20%D0%9F%D1%80%D0%BE%D0%BA%D0%BB%D1%8F%D1%82%D1%82%D1%8F%20%D1%82%D0%B8%D1%82%D0%B0%D0%BD%D0%B0",
	},
	{
		id: 11,
		title: "Персі Джексон і Битва в лабіринті",
		author: "Рік Ріордан",
		price: 290,
		genre: "Фентезі",
		pages: 361,
		publishedYear: 2008,
		stock: 12,
		description: "Лабіринт Дедала веде просто під табір напівкровних.",
		coverImageUrl:
			"https://placehold.co/400x600/EBD9B4/3A2F28?text=%D0%9F%D0%B5%D1%80%D1%81%D1%96%20%D0%94%D0%B6%D0%B5%D0%BA%D1%81%D0%BE%D0%BD%20%D1%96%20%D0%91%D0%B8%D1%82%D0%B2%D0%B0%20%D0%B2%20%D0%BB%D0%B0%D0%B1%D1%96%D1%80%D0%B8%D0%BD%D1%82%D1%96",
	},
	{
		id: 12,
		title: "Персі Джексон і Останній олімпієць",
		author: "Рік Ріордан",
		price: 300,
		genre: "Фентезі",
		pages: 381,
		publishedYear: 2009,
		stock: 11,
		description: "Фінальна битва за Олімп у серці Мангеттена.",
		coverImageUrl:
			"https://placehold.co/400x600/EBD9B4/3A2F28?text=%D0%9F%D0%B5%D1%80%D1%81%D1%96%20%D0%94%D0%B6%D0%B5%D0%BA%D1%81%D0%BE%D0%BD%20%D1%96%20%D0%9E%D1%81%D1%82%D0%B0%D0%BD%D0%BD%D1%96%D0%B9%20%D0%BE%D0%BB%D1%96%D0%BC%D0%BF%D1%96%D1%94%D1%86%D1%8C",
	},
	{
		id: 13,
		title: "Відьмак. Останнє бажання",
		author: "Анджей Сапковський",
		price: 300,
		genre: "Фентезі",
		pages: 288,
		publishedYear: 1993,
		stock: 12,
		description: "Збірка оповідань, що знайомить із відьмаком Ґеральтом із Рівії.",
		coverImageUrl:
			"https://placehold.co/400x600/EBD9B4/3A2F28?text=%D0%92%D1%96%D0%B4%D1%8C%D0%BC%D0%B0%D0%BA.%20%D0%9E%D1%81%D1%82%D0%B0%D0%BD%D0%BD%D1%94%20%D0%B1%D0%B0%D0%B6%D0%B0%D0%BD%D0%BD%D1%8F",
	},
	{
		id: 14,
		title: "Відьмак. Меч призначення",
		author: "Анджей Сапковський",
		price: 300,
		genre: "Фентезі",
		pages: 384,
		publishedYear: 1992,
		stock: 11,
		description: "Другий збірник оповідань, що передує головному циклу.",
		coverImageUrl:
			"https://placehold.co/400x600/EBD9B4/3A2F28?text=%D0%92%D1%96%D0%B4%D1%8C%D0%BC%D0%B0%D0%BA.%20%D0%9C%D0%B5%D1%87%20%D0%BF%D1%80%D0%B8%D0%B7%D0%BD%D0%B0%D1%87%D0%B5%D0%BD%D0%BD%D1%8F",
	},
	{
		id: 15,
		title: "Відьмак. Кров ельфів",
		author: "Анджей Сапковський",
		price: 320,
		genre: "Фентезі",
		pages: 384,
		publishedYear: 1994,
		stock: 10,
		description: "Перший том основної саги: доля Цірі стає ключовою.",
		coverImageUrl:
			"https://placehold.co/400x600/EBD9B4/3A2F28?text=%D0%92%D1%96%D0%B4%D1%8C%D0%BC%D0%B0%D0%BA.%20%D0%9A%D1%80%D0%BE%D0%B2%20%D0%B5%D0%BB%D1%8C%D1%84%D1%96%D0%B2",
	},
	{
		id: 16,
		title: "Відьмак. Час погорди",
		author: "Анджей Сапковський",
		price: 320,
		genre: "Фентезі",
		pages: 320,
		publishedYear: 1995,
		stock: 9,
		description: "Війна насувається на Північні королівства.",
		coverImageUrl:
			"https://placehold.co/400x600/EBD9B4/3A2F28?text=%D0%92%D1%96%D0%B4%D1%8C%D0%BC%D0%B0%D0%BA.%20%D0%A7%D0%B0%D1%81%20%D0%BF%D0%BE%D0%B3%D0%BE%D1%80%D0%B4%D0%B8",
	},
	{
		id: 17,
		title: "Відьмак. Хрещення вогнем",
		author: "Анджей Сапковський",
		price: 320,
		genre: "Фентезі",
		pages: 352,
		publishedYear: 1996,
		stock: 9,
		description: "Ґеральт збирає загін, щоб знайти зниклу Цірі.",
		coverImageUrl:
			"https://placehold.co/400x600/EBD9B4/3A2F28?text=%D0%92%D1%96%D0%B4%D1%8C%D0%BC%D0%B0%D0%BA.%20%D0%A5%D1%80%D0%B5%D1%89%D0%B5%D0%BD%D0%BD%D1%8F%20%D0%B2%D0%BE%D0%B3%D0%BD%D0%B5%D0%BC",
	},
	{
		id: 18,
		title: "Відьмак. Вежа Ластівки",
		author: "Анджей Сапковський",
		price: 330,
		genre: "Фентезі",
		pages: 448,
		publishedYear: 1997,
		stock: 8,
		description: "Цірі тікає крізь час і простір, рятуючись від переслідувачів.",
		coverImageUrl:
			"https://placehold.co/400x600/EBD9B4/3A2F28?text=%D0%92%D1%96%D0%B4%D1%8C%D0%BC%D0%B0%D0%BA.%20%D0%92%D0%B5%D0%B6%D0%B0%20%D0%9B%D0%B0%D1%81%D1%82%D1%96%D0%B2%D0%BA%D0%B8",
	},
	{
		id: 19,
		title: "Відьмак. Володарка Озера",
		author: "Анджей Сапковський",
		price: 340,
		genre: "Фентезі",
		pages: 448,
		publishedYear: 1999,
		stock: 8,
		description: "Завершення саги про відьмака Ґеральта і його прийомну доньку.",
		coverImageUrl:
			"https://placehold.co/400x600/EBD9B4/3A2F28?text=%D0%92%D1%96%D0%B4%D1%8C%D0%BC%D0%B0%D0%BA.%20%D0%92%D0%BE%D0%BB%D0%BE%D0%B4%D0%B0%D1%80%D0%BA%D0%B0%20%D0%9E%D0%B7%D0%B5%D1%80%D0%B0",
	},
	{
		id: 20,
		title: "Мандрівний замок Хаула",
		author: "Діана Вінн Джонс",
		price: 300,
		genre: "Фентезі",
		pages: 320,
		publishedYear: 1986,
		stock: 11,
		description:
			"Софі перетворена на стареньку і оселяється в мандрівному замку чарівника Хаула.",
		coverImageUrl:
			"https://placehold.co/400x600/EBD9B4/3A2F28?text=%D0%9C%D0%B0%D0%BD%D0%B4%D1%80%D1%96%D0%B2%D0%BD%D0%B8%D0%B9%20%D0%B7%D0%B0%D0%BC%D0%BE%D0%BA%20%D0%A5%D0%B0%D1%83%D0%BB%D0%B0",
	},
	{
		id: 21,
		title: "Повітряний замок",
		author: "Діана Вінн Джонс",
		price: 300,
		genre: "Фентезі",
		pages: 336,
		publishedYear: 1990,
		stock: 9,
		description: "Друга книга циклу: нові пригоди у світі летючих килимів і духів.",
		coverImageUrl:
			"https://placehold.co/400x600/EBD9B4/3A2F28?text=%D0%9F%D0%BE%D0%B2%D1%96%D1%82%D1%80%D1%8F%D0%BD%D0%B8%D0%B9%20%D0%B7%D0%B0%D0%BC%D0%BE%D0%BA",
	},
	{
		id: 22,
		title: "Дім із багатьма шляхами",
		author: "Діана Вінн Джонс",
		price: 300,
		genre: "Фентезі",
		pages: 344,
		publishedYear: 2008,
		stock: 8,
		description: "Третя книга циклу: чарівний будинок із дверима в різні місця.",
		coverImageUrl:
			"https://placehold.co/400x600/EBD9B4/3A2F28?text=%D0%94%D1%96%D0%BC%20%D1%96%D0%B7%20%D0%B1%D0%B0%D0%B3%D0%B0%D1%82%D1%8C%D0%BC%D0%B0%20%D1%88%D0%BB%D1%8F%D1%85%D0%B0%D0%BC%D0%B8",
	},
	{
		id: 23,
		title: "Чистий код",
		author: "Роберт Мартін",
		price: 450,
		genre: "IT",
		pages: 464,
		publishedYear: 2008,
		stock: 10,
		description: "Практичний посібник з написання зрозумілого, підтримуваного коду.",
		coverImageUrl:
			"https://placehold.co/400x600/EBD9B4/3A2F28?text=%D0%A7%D0%B8%D1%81%D1%82%D0%B8%D0%B9%20%D0%BA%D0%BE%D0%B4",
	},
	{
		id: 24,
		title: "Прийоми об'єктно-орієнтованого проєктування. Патерни проєктування",
		author: "Еріх Гамма, Річард Хелм, Ральф Джонсон, Джон Вліссідес",
		price: 470,
		genre: "IT",
		pages: 416,
		publishedYear: 1994,
		stock: 8,
		description: "Класична книга «банди чотирьох» про патерни проєктування ПЗ.",
		coverImageUrl:
			"https://placehold.co/400x600/EBD9B4/3A2F28?text=%D0%9F%D1%80%D0%B8%D0%B9%D0%BE%D0%BC%D0%B8%20%D0%BE%D0%B1%27%D1%94%D0%BA%D1%82%D0%BD%D0%BE-%D0%BE%D1%80%D1%96%D1%94%D0%BD%D1%82%D0%BE%D0%B2%D0%B0%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%BF%D1%80%D0%BE%D1%94%D0%BA%D1%82%D1%83%D0%B2%D0%B0%D0%BD%D0%BD%D1%8F.%20%D0%9F%D0%B0%D1%82%D0%B5%D1%80%D0%BD%D0%B8%20%D0%BF%D1%80%D0%BE%D1%94%D0%BA%D1%82%D1%83%D0%B2%D0%B0%D0%BD%D0%BD%D1%8F",
	},
];

const RAW_EN = [
	{
		id: 1,
		title: "Harry Potter and the Philosopher's Stone",
		author: "J.K. Rowling",
		price: 320,
		genre: "Fantasy",
		pages: 320,
		publishedYear: 1997,
		stock: 20,
		description:
			"Book one of the saga: a boy discovers he is a wizard and sets off for Hogwarts.",
		coverImageUrl:
			"https://placehold.co/400x600/EBD9B4/3A2F28?text=%D0%93%D0%B0%D1%80%D1%80%D1%96%20%D0%9F%D0%BE%D1%82%D1%82%D0%B5%D1%80%20%D1%96%20%D1%84%D1%96%D0%BB%D0%BE%D1%81%D0%BE%D1%84%D1%81%D1%8C%D0%BA%D0%B8%D0%B9%20%D0%BA%D0%B0%D0%BC%D1%96%D0%BD%D1%8C",
	},
	{
		id: 2,
		title: "Harry Potter and the Chamber of Secrets",
		author: "J.K. Rowling",
		price: 320,
		genre: "Fantasy",
		pages: 336,
		publishedYear: 1998,
		stock: 18,
		description:
			"Second year at Hogwarts: someone has opened the Chamber of Secrets.",
		coverImageUrl:
			"https://placehold.co/400x600/EBD9B4/3A2F28?text=%D0%93%D0%B0%D1%80%D1%80%D1%96%20%D0%9F%D0%BE%D1%82%D1%82%D0%B5%D1%80%20%D1%96%20%D1%82%D0%B0%D1%94%D0%BC%D0%BD%D0%B0%20%D0%BA%D1%96%D0%BC%D0%BD%D0%B0%D1%82%D0%B0",
	},
	{
		id: 3,
		title: "Harry Potter and the Prisoner of Azkaban",
		author: "J.K. Rowling",
		price: 330,
		genre: "Fantasy",
		pages: 448,
		publishedYear: 1999,
		stock: 16,
		description: "Third year: a dangerous prisoner has escaped from Azkaban.",
		coverImageUrl:
			"https://placehold.co/400x600/EBD9B4/3A2F28?text=%D0%93%D0%B0%D1%80%D1%80%D1%96%20%D0%9F%D0%BE%D1%82%D1%82%D0%B5%D1%80%20%D1%96%20%D0%B2%27%D1%8F%D0%B7%D0%B5%D0%BD%D1%8C%20%D0%90%D0%B7%D0%BA%D0%B0%D0%B1%D0%B0%D0%BD%D1%83",
	},
	{
		id: 4,
		title: "Harry Potter and the Goblet of Fire",
		author: "J.K. Rowling",
		price: 360,
		genre: "Fantasy",
		pages: 640,
		publishedYear: 2000,
		stock: 14,
		description: "The Triwizard Tournament — and the return of the Dark Lord.",
		coverImageUrl:
			"https://placehold.co/400x600/EBD9B4/3A2F28?text=%D0%93%D0%B0%D1%80%D1%80%D1%96%20%D0%9F%D0%BE%D1%82%D1%82%D0%B5%D1%80%20%D1%96%20%D0%BA%D0%B5%D0%BB%D0%B8%D1%85%20%D0%B2%D0%BE%D0%B3%D0%BD%D1%8E",
	},
	{
		id: 5,
		title: "Harry Potter and the Order of the Phoenix",
		author: "J.K. Rowling",
		price: 390,
		genre: "Fantasy",
		pages: 768,
		publishedYear: 2003,
		stock: 12,
		description: "Fifth year: a secret society stands against the Ministry of Magic.",
		coverImageUrl:
			"https://placehold.co/400x600/EBD9B4/3A2F28?text=%D0%93%D0%B0%D1%80%D1%80%D1%96%20%D0%9F%D0%BE%D1%82%D1%82%D0%B5%D1%80%20%D1%96%20%D0%BE%D1%80%D0%B4%D0%B5%D0%BD%20%D0%A4%D0%B5%D0%BD%D1%96%D0%BA%D1%81%D0%B0",
	},
	{
		id: 6,
		title: "Harry Potter and the Half-Blood Prince",
		author: "J.K. Rowling",
		price: 370,
		genre: "Fantasy",
		pages: 608,
		publishedYear: 2005,
		stock: 12,
		description: "Sixth year: Voldemort's past, and a mysterious old textbook.",
		coverImageUrl:
			"https://placehold.co/400x600/EBD9B4/3A2F28?text=%D0%93%D0%B0%D1%80%D1%80%D1%96%20%D0%9F%D0%BE%D1%82%D1%82%D0%B5%D1%80%20%D1%96%20%D0%BD%D0%B0%D0%BF%D1%96%D0%B2%D0%BA%D1%80%D0%BE%D0%B2%D0%BD%D0%B8%D0%B9%20%D0%BF%D1%80%D0%B8%D0%BD%D1%86",
	},
	{
		id: 7,
		title: "Harry Potter and the Deathly Hallows",
		author: "J.K. Rowling",
		price: 400,
		genre: "Fantasy",
		pages: 704,
		publishedYear: 2007,
		stock: 10,
		description:
			"The saga's finale: the hunt for the Horcruxes and the final battle.",
		coverImageUrl:
			"https://placehold.co/400x600/EBD9B4/3A2F28?text=%D0%93%D0%B0%D1%80%D1%80%D1%96%20%D0%9F%D0%BE%D1%82%D1%82%D0%B5%D1%80%20%D1%96%20%D1%81%D0%BC%D0%B5%D1%80%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D1%96%20%D1%80%D0%B5%D0%BB%D1%96%D0%BA%D0%B2%D1%96%D1%97",
	},
	{
		id: 8,
		title: "Percy Jackson and the Lightning Thief",
		author: "Rick Riordan",
		price: 280,
		genre: "Fantasy",
		pages: 375,
		publishedYear: 2005,
		stock: 15,
		description:
			"A teenager learns he is the son of Poseidon and sets out to save the world of the gods.",
		coverImageUrl:
			"https://placehold.co/400x600/EBD9B4/3A2F28?text=%D0%9F%D0%B5%D1%80%D1%81%D1%96%20%D0%94%D0%B6%D0%B5%D0%BA%D1%81%D0%BE%D0%BD%20%D1%96%20%D0%92%D0%B8%D0%BA%D1%80%D0%B0%D0%B4%D0%B0%D1%87%20%D0%B1%D0%BB%D0%B8%D1%81%D0%BA%D0%B0%D0%B2%D0%BE%D0%BA",
	},
	{
		id: 9,
		title: "Percy Jackson and the Sea of Monsters",
		author: "Rick Riordan",
		price: 280,
		genre: "Fantasy",
		pages: 279,
		publishedYear: 2006,
		stock: 14,
		description:
			"A quest for the Golden Fleece across the Sea of Monsters (the Bermuda Triangle).",
		coverImageUrl:
			"https://placehold.co/400x600/EBD9B4/3A2F28?text=%D0%9F%D0%B5%D1%80%D1%81%D1%96%20%D0%94%D0%B6%D0%B5%D0%BA%D1%81%D0%BE%D0%BD%20%D1%96%20%D0%9C%D0%BE%D1%80%D0%B5%20%D1%87%D1%83%D0%B4%D0%BE%D0%B2%D0%B8%D1%81%D1%8C%D0%BA",
	},
	{
		id: 10,
		title: "Percy Jackson and the Titan's Curse",
		author: "Rick Riordan",
		price: 290,
		genre: "Fantasy",
		pages: 312,
		publishedYear: 2007,
		stock: 13,
		description:
			"Artemis goes missing, and Percy sets out to find her with new friends at his side.",
		coverImageUrl:
			"https://placehold.co/400x600/EBD9B4/3A2F28?text=%D0%9F%D0%B5%D1%80%D1%81%D1%96%20%D0%94%D0%B6%D0%B5%D0%BA%D1%81%D0%BE%D0%BD%20%D1%96%20%D0%9F%D1%80%D0%BE%D0%BA%D0%BB%D1%8F%D1%82%D1%82%D1%8F%20%D1%82%D0%B8%D1%82%D0%B0%D0%BD%D0%B0",
	},
	{
		id: 11,
		title: "Percy Jackson and the Battle of the Labyrinth",
		author: "Rick Riordan",
		price: 290,
		genre: "Fantasy",
		pages: 361,
		publishedYear: 2008,
		stock: 12,
		description: "Daedalus's labyrinth runs right underneath Camp Half-Blood.",
		coverImageUrl:
			"https://placehold.co/400x600/EBD9B4/3A2F28?text=%D0%9F%D0%B5%D1%80%D1%81%D1%96%20%D0%94%D0%B6%D0%B5%D0%BA%D1%81%D0%BE%D0%BD%20%D1%96%20%D0%91%D0%B8%D1%82%D0%B2%D0%B0%20%D0%B2%20%D0%BB%D0%B0%D0%B1%D1%96%D1%80%D0%B8%D0%BD%D1%82%D1%96",
	},
	{
		id: 12,
		title: "Percy Jackson and the Last Olympian",
		author: "Rick Riordan",
		price: 300,
		genre: "Fantasy",
		pages: 381,
		publishedYear: 2009,
		stock: 11,
		description: "The final battle for Olympus, fought in the heart of Manhattan.",
		coverImageUrl:
			"https://placehold.co/400x600/EBD9B4/3A2F28?text=%D0%9F%D0%B5%D1%80%D1%81%D1%96%20%D0%94%D0%B6%D0%B5%D0%BA%D1%81%D0%BE%D0%BD%20%D1%96%20%D0%9E%D1%81%D1%82%D0%B0%D0%BD%D0%BD%D1%96%D0%B9%20%D0%BE%D0%BB%D1%96%D0%BC%D0%BF%D1%96%D1%94%D1%86%D1%8C",
	},
	{
		id: 13,
		title: "The Witcher: The Last Wish",
		author: "Andrzej Sapkowski",
		price: 300,
		genre: "Fantasy",
		pages: 288,
		publishedYear: 1993,
		stock: 12,
		description: "A short-story collection introducing the witcher Geralt of Rivia.",
		coverImageUrl:
			"https://placehold.co/400x600/EBD9B4/3A2F28?text=%D0%92%D1%96%D0%B4%D1%8C%D0%BC%D0%B0%D0%BA.%20%D0%9E%D1%81%D1%82%D0%B0%D0%BD%D0%BD%D1%94%20%D0%B1%D0%B0%D0%B6%D0%B0%D0%BD%D0%BD%D1%8F",
	},
	{
		id: 14,
		title: "The Witcher: Sword of Destiny",
		author: "Andrzej Sapkowski",
		price: 300,
		genre: "Fantasy",
		pages: 384,
		publishedYear: 1992,
		stock: 11,
		description: "A second story collection that leads into the main saga.",
		coverImageUrl:
			"https://placehold.co/400x600/EBD9B4/3A2F28?text=%D0%92%D1%96%D0%B4%D1%8C%D0%BC%D0%B0%D0%BA.%20%D0%9C%D0%B5%D1%87%20%D0%BF%D1%80%D0%B8%D0%B7%D0%BD%D0%B0%D1%87%D0%B5%D0%BD%D0%BD%D1%8F",
	},
	{
		id: 15,
		title: "The Witcher: Blood of Elves",
		author: "Andrzej Sapkowski",
		price: 320,
		genre: "Fantasy",
		pages: 384,
		publishedYear: 1994,
		stock: 10,
		description: "Book one of the main saga: Ciri's fate takes center stage.",
		coverImageUrl:
			"https://placehold.co/400x600/EBD9B4/3A2F28?text=%D0%92%D1%96%D0%B4%D1%8C%D0%BC%D0%B0%D0%BA.%20%D0%9A%D1%80%D0%BE%D0%B2%20%D0%B5%D0%BB%D1%8C%D1%84%D1%96%D0%B2",
	},
	{
		id: 16,
		title: "The Witcher: Time of Contempt",
		author: "Andrzej Sapkowski",
		price: 320,
		genre: "Fantasy",
		pages: 320,
		publishedYear: 1995,
		stock: 9,
		description: "War closes in on the Northern Kingdoms.",
		coverImageUrl:
			"https://placehold.co/400x600/EBD9B4/3A2F28?text=%D0%92%D1%96%D0%B4%D1%8C%D0%BC%D0%B0%D0%BA.%20%D0%A7%D0%B0%D1%81%20%D0%BF%D0%BE%D0%B3%D0%BE%D1%80%D0%B4%D0%B8",
	},
	{
		id: 17,
		title: "The Witcher: Baptism of Fire",
		author: "Andrzej Sapkowski",
		price: 320,
		genre: "Fantasy",
		pages: 352,
		publishedYear: 1996,
		stock: 9,
		description: "Geralt gathers a company to find the missing Ciri.",
		coverImageUrl:
			"https://placehold.co/400x600/EBD9B4/3A2F28?text=%D0%92%D1%96%D0%B4%D1%8C%D0%BC%D0%B0%D0%BA.%20%D0%A5%D1%80%D0%B5%D1%89%D0%B5%D0%BD%D0%BD%D1%8F%20%D0%B2%D0%BE%D0%B3%D0%BD%D0%B5%D0%BC",
	},
	{
		id: 18,
		title: "The Witcher: The Tower of the Swallow",
		author: "Andrzej Sapkowski",
		price: 330,
		genre: "Fantasy",
		pages: 448,
		publishedYear: 1997,
		stock: 8,
		description: "Ciri flees across time and space to escape her pursuers.",
		coverImageUrl:
			"https://placehold.co/400x600/EBD9B4/3A2F28?text=%D0%92%D1%96%D0%B4%D1%8C%D0%BC%D0%B0%D0%BA.%20%D0%92%D0%B5%D0%B6%D0%B0%20%D0%9B%D0%B0%D1%81%D1%82%D1%96%D0%B2%D0%BA%D0%B8",
	},
	{
		id: 19,
		title: "The Witcher: The Lady of the Lake",
		author: "Andrzej Sapkowski",
		price: 340,
		genre: "Fantasy",
		pages: 448,
		publishedYear: 1999,
		stock: 8,
		description: "The saga's conclusion, following Geralt and his adopted daughter.",
		coverImageUrl:
			"https://placehold.co/400x600/EBD9B4/3A2F28?text=%D0%92%D1%96%D0%B4%D1%8C%D0%BC%D0%B0%D0%BA.%20%D0%92%D0%BE%D0%BB%D0%BE%D0%B4%D0%B0%D1%80%D0%BA%D0%B0%20%D0%9E%D0%B7%D0%B5%D1%80%D0%B0",
	},
	{
		id: 20,
		title: "Howl's Moving Castle",
		author: "Diana Wynne Jones",
		price: 300,
		genre: "Fantasy",
		pages: 320,
		publishedYear: 1986,
		stock: 11,
		description:
			"Sophie is turned into an old woman and moves into the wizard Howl's moving castle.",
		coverImageUrl:
			"https://placehold.co/400x600/EBD9B4/3A2F28?text=%D0%9C%D0%B0%D0%BD%D0%B4%D1%80%D1%96%D0%B2%D0%BD%D0%B8%D0%B9%20%D0%B7%D0%B0%D0%BC%D0%BE%D0%BA%20%D0%A5%D0%B0%D1%83%D0%BB%D0%B0",
	},
	{
		id: 21,
		title: "Castle in the Air",
		author: "Diana Wynne Jones",
		price: 300,
		genre: "Fantasy",
		pages: 336,
		publishedYear: 1990,
		stock: 9,
		description:
			"Book two of the cycle: new adventures in a world of flying carpets and genies.",
		coverImageUrl:
			"https://placehold.co/400x600/EBD9B4/3A2F28?text=%D0%9F%D0%BE%D0%B2%D1%96%D1%82%D1%80%D1%8F%D0%BD%D0%B8%D0%B9%20%D0%B7%D0%B0%D0%BC%D0%BE%D0%BA",
	},
	{
		id: 22,
		title: "House of Many Ways",
		author: "Diana Wynne Jones",
		price: 300,
		genre: "Fantasy",
		pages: 344,
		publishedYear: 2008,
		stock: 8,
		description:
			"Book three of the cycle: an enchanted house whose doors lead to many places.",
		coverImageUrl:
			"https://placehold.co/400x600/EBD9B4/3A2F28?text=%D0%94%D1%96%D0%BC%20%D1%96%D0%B7%20%D0%B1%D0%B0%D0%B3%D0%B0%D1%82%D1%8C%D0%BC%D0%B0%20%D1%88%D0%BB%D1%8F%D1%85%D0%B0%D0%BC%D0%B8",
	},
	{
		id: 23,
		title: "Clean Code",
		author: "Robert C. Martin",
		price: 450,
		genre: "IT",
		pages: 464,
		publishedYear: 2008,
		stock: 10,
		description: "A practical guide to writing clear, maintainable code.",
		coverImageUrl:
			"https://placehold.co/400x600/EBD9B4/3A2F28?text=%D0%A7%D0%B8%D1%81%D1%82%D0%B8%D0%B9%20%D0%BA%D0%BE%D0%B4",
	},
	{
		id: 24,
		title: "Design Patterns: Elements of Reusable Object-Oriented Software",
		author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
		price: 470,
		genre: "IT",
		pages: 416,
		publishedYear: 1994,
		stock: 8,
		description:
			"The classic 'Gang of Four' book on reusable software design patterns.",
		coverImageUrl:
			"https://placehold.co/400x600/EBD9B4/3A2F28?text=%D0%9F%D1%80%D0%B8%D0%B9%D0%BE%D0%BC%D0%B8%20%D0%BE%D0%B1%27%D1%94%D0%BA%D1%82%D0%BD%D0%BE-%D0%BE%D1%80%D1%96%D1%94%D0%BD%D1%82%D0%BE%D0%B2%D0%B0%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%BF%D1%80%D0%BE%D1%94%D0%BA%D1%82%D1%83%D0%B2%D0%B0%D0%BD%D0%BD%D1%8F.%20%D0%9F%D0%B0%D1%82%D0%B5%D1%80%D0%BD%D0%B8%20%D0%BF%D1%80%D0%BE%D1%94%D0%BA%D1%82%D1%83%D0%B2%D0%B0%D0%BD%D0%BD%D1%8F",
	},
];

// ─── Validated exports ────────────────────────────────────────────────────────

export const MOCK_BOOKS_UK: Book[] = BooksArraySchema.parse(RAW_UK);
export const MOCK_BOOKS_EN: Book[] = BooksArraySchema.parse(RAW_EN);

export const MOCK_BOOKS_BY_LOCALE: Record<Locale, Book[]> = {
	uk: MOCK_BOOKS_UK,
	en: MOCK_BOOKS_EN,
};

/** @deprecated Use MOCK_BOOKS_BY_LOCALE.uk instead. */
export const MOCK_BOOKS: Book[] = MOCK_BOOKS_UK;

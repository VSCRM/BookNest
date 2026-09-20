import {describe, it, expect, vi} from "vitest";
import {render, screen, fireEvent} from "@testing-library/react";
import {ProfileInfo} from "./ProfileInfo";
import {LocaleWrapper, MOCK_USER} from "../../tests/testHelpers";

const renderInfo = (onEdit = vi.fn()) =>
	render(
		<LocaleWrapper>
			<ProfileInfo user={MOCK_USER} onEdit={onEdit} />
		</LocaleWrapper>,
	);

describe("ProfileInfo", () => {
	it("renders the user nickname", () => {
		renderInfo();
		expect(screen.getByText(MOCK_USER.nickname!)).toBeInTheDocument();
	});

	it("renders the user email with @ prefix", () => {
		renderInfo();
		expect(screen.getByText(`@${MOCK_USER.username}`)).toBeInTheDocument();
	});

	it("renders the avatar initial", () => {
		renderInfo();
		expect(screen.getByText("T")).toBeInTheDocument(); // 'Tester'[0]
	});

	it("calls onEdit when the edit button is clicked", () => {
		const onEdit = vi.fn();
		renderInfo(onEdit);
		fireEvent.click(screen.getByRole("button", {name: /редагувати/i}));
		expect(onEdit).toHaveBeenCalledTimes(1);
	});

	it("falls back to username initial when nickname is undefined", () => {
		render(
			<LocaleWrapper>
				<ProfileInfo user={{username: "alpha@x.com"}} onEdit={vi.fn()} />
			</LocaleWrapper>,
		);
		expect(screen.getByText("a")).toBeInTheDocument();
	});
});

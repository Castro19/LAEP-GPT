import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";
import { renderWithProviders } from "@/utils/test-utils";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import {
  fetchSectionsAsync,
  setFilters,
  setPage,
} from "@/redux/classSearch/classSearchSlice";
import { getInitialFilterValues } from "@/components/classSearch/courseFilters/helpers/constants";
import { mockSections } from "@/utils/mockData";
import { AppDispatch } from "@/redux/store";

// Setup MSW server
const handlers = [
  http.get("http://localhost:4000/classSearch", () => {
    return HttpResponse.json({ data: mockSections, page: 1, totalPages: 1 });
  }),
];

const server = setupServer(...handlers);

// Setup and teardown
beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("classSearchSlice", () => {
  it("sets filters and page via reducers", () => {
    const { store } = renderWithProviders(<div />);
    const newFilters = { ...getInitialFilterValues(), subject: "TEST" };

    store.dispatch(setFilters(newFilters));
    store.dispatch(setPage(3));

    const state = store.getState().classSearch;
    expect(state.filters.subject).toBe("TEST");
    expect(state.page).toBe(3);
  });

  it("fetches sections and updates state via fetchSectionsAsync", async () => {
    const { store } = renderWithProviders(<div />);
    await (store.dispatch as AppDispatch)(fetchSectionsAsync());

    const state = store.getState().classSearch;
    expect(state.loading).toBe(false);
    expect(state.sections.length).toBe(1);
    expect(state.sections[0].classNumber).toBe(1234);
    expect(state.page).toBe(1);
    expect(state.totalPages).toBe(1);
  });

  it("handles fetchSectionsAsync errors", async () => {
    server.use(
      http.get("http://localhost:4000/classSearch", () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    const { store } = renderWithProviders(<div />);
    await (store.dispatch as AppDispatch)(fetchSectionsAsync());

    const state = store.getState().classSearch;
    expect(state.loading).toBe(false);
    expect(state.error).toBeTruthy();
  });
});

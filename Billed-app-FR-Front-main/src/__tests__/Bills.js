/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import Bills from "../containers/Bills.js";
import router from "../app/Router.js";
import mockStore from "../__mocks__/store";
import userEvent from "@testing-library/user-event";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");
      //to-do write expect expression
      expect(windowIcon.classList.contains("active-icon")).toBe(true);
    });
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      console.log("dates",dates);
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });
  });
  
  describe("When I click on the new bill button", () => {
    test("Then I should go to new bill form page", () => {

      document.body.innerHTML = BillsUI({ data: bills });
      const billContainer = new Bills({
        document,
        onNavigate: (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        },
        store: mockStore,
        localStorage: window.localStorage
      });

      const newBillBtn = screen.getByTestId("btn-new-bill");
  
      userEvent.click(newBillBtn);
  
      expect(screen.getByTestId("form-new-bill")).toBeTruthy();
    });
  });  
  describe("When I click on the eye icon", () => {
    test("Then a modal should open with the correct bill URL", () => {
      $.fn.modal = jest.fn();
      const billsPage = BillsUI({ data: bills });

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      document.body.innerHTML = billsPage;
      const billContainer = new Bills({
        document,
        onNavigate,
        mockStore,
       localStorage: window.localStorage
      }
      );

      const iconEye = screen.getAllByTestId('icon-eye');
      const firstIconEye = iconEye[0];
      userEvent.click(firstIconEye);

      const billModal =  screen.getByTestId("modaleFile");
      const billUrl = firstIconEye.getAttribute('data-bill-url').split('?')[0];

      // console.log(billModal);
      expect(billModal).toBeTruthy();
      expect(billModal.innerHTML.includes(billUrl)).toBeTruthy();
      expect($.fn.modal).toHaveBeenCalled();

    })
  });

  describe("When the getBills method is called", () => {
    test("Then it should return the bills formatted in an array", async () => {
      const billsContainer = new Bills({
        document,
        onNavigate: () => {},
        store: mockStore,
        localStorage: window.localStorage
      });
  
      const result = await billsContainer.getBills();
  
      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(Array);

    });
  });
  
});

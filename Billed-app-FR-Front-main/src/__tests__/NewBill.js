/**
 * @jest-environment jsdom
 */
import { localStorageMock } from "../__mocks__/localStorage.js"
import { ROUTES_PATH } from "../constants/routes"
import router from "../app/Router"
import { screen } from "@testing-library/dom"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then icon mail in vertical layout should be highlighted", () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      let root = document.createElement('div');
      root.setAttribute('id','root');
      window.location.assign(ROUTES_PATH.NewBill);
      document.body.appendChild(root);
      router();
      const mailIcon = screen.getByTestId('icon-mail');
      expect(mailIcon.classList.contains('active-icon')).toBeTruthy();

    })
  });
})

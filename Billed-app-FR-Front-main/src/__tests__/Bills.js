/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";

import router from "../app/Router.js";
import mockStore from "../__mocks__/store"

// jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
    //to-do write expect expression
      expect(windowIcon).toBeTruthy()

    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
    //Ajout de tests unitaires et d'intégration
    test("fetches bills from mock API GET", async () => {
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)

      // const contentType = await waitFor(() => screen.getByText("Type"))
      // expect(contentType).toBeTruthy()
      // const contentNom = await waitFor(() => screen.getByText("Nom"))
      // expect(contentNom).toBeTruthy()
      // const contentDate = await waitFor(() => screen.getByText("Date"))
      // expect(contentDate).toBeTruthy()
      // const contentMontant = await waitFor(() => screen.getByText("Montant"))
      // expect(contentMontant).toBeTruthy()
      // const contentStatut = await waitFor(() => screen.getByText("Statut"))
      // expect(contentStatut).toBeTruthy()
      // const contentActions = await waitFor(() => screen.getByText("Actions"))
      // expect(contentActions).toBeTruthy()
      
      const headers = ["Type", "Nom", "Date", "Montant", "Statut", "Actions", "Nouvelle note de frais", "Hôtel et logement", "400 €"];

      for (let i = 0; i < headers.length; i++) {
        const header = await waitFor(() => screen.getByText(headers[i]));
        expect(header).toBeTruthy();
      }
      // const contentNewBill = await waitFor(() => screen.getByText("Nouvelle note de frais"))
      // expect(contentNewBill).toBeTruthy()
      // const contentHotel = await waitFor(() => screen.getByText("Hôtel et logement"))
      // expect(contentHotel).toBeTruthy()
      // const contentPrice = await waitFor(() => screen.getByText("400 €"))
      // expect(contentPrice).toBeTruthy()
    })    
  })
  describe("When an error occurs on API", () => {
    beforeEach(() => {
      jest.spyOn(mockStore, "bills")
      Object.defineProperty(
          window,
          'localStorage',
          { value: localStorageMock }
      )
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "a@a"
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.appendChild(root)
      router()
    })
    test("fetches bills from an API and fails with 404 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 404"))
          }
        }})
      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick);
      const message = await screen.getByText("Erreur")
      expect(message).toBeTruthy()
    })
  })
})






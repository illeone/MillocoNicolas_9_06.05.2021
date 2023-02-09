/**
 * @jest-environment jsdom
 */

import {screen, fireEvent, waitFor} from "@testing-library/dom"
import router from "../app/Router.js";
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"
// import NewBillUI from "../views/NewBillUI.js"
// import NewBill from "../containers/NewBill.js"

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
      
      //to-do write assertion

      describe('Le formulaire de nouvelle note de frais', () => {
        //jest.spyOn(mockStore, "bills")
        global.fetch = jest.fn(() => {
          Promise.resolve({
            json: () => mockStore.list(),
          })
        })
        beforeEach(() => {//fonction qui est exécutée avant chaque test
          Object.defineProperty(window, 'localStorage', { value: localStorageMock })
          window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
          }))
          const root = document.createElement("div")
          root.setAttribute("id", "root")
          document.body.append(root)
          router()
          window.onNavigate(ROUTES_PATH.NewBill)
        });

        test('Le composant affiche un formulaire contenant les champs appropriés', async () => {    
          expect(screen.getByTestId('expense-type')).toBeTruthy();
          expect(screen.getByTestId('expense-name')).toBeTruthy();
          expect(screen.getByTestId('amount')).toBeTruthy();
          expect(screen.getByTestId('vat')).toBeTruthy();
          expect(screen.getByTestId('pct')).toBeTruthy();
          expect(screen.getByTestId('commentary')).toBeTruthy();
          expect(screen.getByTestId('file')).toBeTruthy();
          expect(screen.getByText("Envoyer")).toBeTruthy();
        });

        test('Le composant affiche un formulaire contenant les champs appropriés', async () => {  
          
          // const selectExpensiveType = screen.getByTestId('expense-type')
          // fireEvent.change(selectExpensiveType, {target:{value:'Transports'}})  
          //expect(selectExpensiveType.value).toBe('azerty') //pour tester le contenu de l'input
          fireEvent.change(screen.getByTestId('expense-type'), {target:{value:'Transports'}}) 
          
          fireEvent.submit(screen.getByTestId('form-new-bill'))//test le click du bouton

          expect(global.window.location.href).toContain("/bills")// test la redirection de page
          

          // expect(screen.getByTestId('expense-name')).toHaveProperty('value', '');
          // expect(screen.getByTestId('amount')).toHaveProperty('value', '');
          // expect(screen.getByTestId('vat')).toHaveProperty('value', '');
          // expect(screen.getByTestId('pct')).toHaveProperty('value', '');
          // expect(screen.getByTestId('commentary')).toHaveProperty('value', '');
        });
        test('Chargement du ficher de note frais', async () => {    
          const file = new File(["FZNEOUFNZEOFUOEF827YHEJK?"], "/nasa/nouvelleFusee.png", {type: "image/png"});
          await waitFor(()=> {
            fireEvent.change(screen.getByTestId('file'), {target: {files: [file]}})
          })     
        });
        test('Chargement du ficher de note frais incorrect', async () => {  
          jest.spyOn(window, "alert").mockImplementation(()=>{});  
          const file = new File(["FZNEOUFNZEOFUOEF827YHEJK?"], "/nasa/nouvelleFusee.docx", {type: "document/docx"});
          await waitFor(()=> {
            fireEvent.change(screen.getByTestId('file'), {target: {files: [file]}})
          }) 
        });
    })
  })
})

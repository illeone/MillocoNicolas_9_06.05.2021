/**
 * @jest-environment jsdom
 */
import { localStorageMock } from "../__mocks__/localStorage.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import router from "../app/Router"
import { fireEvent, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import userEvent from "@testing-library/user-event";
import mockStore from "../__mocks__/store.js";


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
    describe("When I select a file using the file input", ()=>{

      const newBillUiHTML  = NewBillUI();
      document.body.innerHTML = newBillUiHTML;
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
  
      const fileInput = document.querySelector(`input[data-testid="file"]`);
      const container  = new NewBill({
        document:document,
        onNavigate:onNavigate,
        store:mockStore,
        localStorage: window.localStorage
      });
      const fileChange = jest.fn(container.handleChangeFile);
      fileInput.addEventListener('change', (e)=>{
        fileChange(e);
      });
      describe("When the selected file is a jpeg, jpg, png",()=>{
            test("then the input file border should be green",()=>{
              const file = new File(['helloworld'], "image.png", {type: 'image/png'});
              userEvent.upload(fileInput, file);
              expect(fileChange).toHaveBeenCalled();
              expect(fileInput.files[0]).toStrictEqual(file)
              expect(fileInput.classList.contains('valid-file-input'));
            })
      })
      describe("When the selected file is not a jpeg, jpg, png",()=>{
        test("then the input file border should be red",()=>{
          const file = new File(['helloworld'], "image.bmp", {type: 'image/bmp'});
          userEvent.upload(fileInput, file);
          expect(fileChange).toHaveBeenCalled();
          expect(fileInput.files[0]).toStrictEqual(file)
          expect(fileInput.classList.contains('valid-file-input')).toBeFalsy();
        })
      })
    })
  })
});

// test d'intégration POST
describe("Given I am connected as an employee", () => {
  describe("When I submit the new bill form", () => {
    test("Then handleSubmit should be called and the store should update the bills", async () => {
      const newBillUiHTML = NewBillUI();

      window.localStorage.setItem('user', JSON.stringify({ 
        type: 'Employee', 
        email: "test@test.com" }));
      document.body.innerHTML = newBillUiHTML;

      const onNavigate = (pathname) => { 
        document.body.innerHTML = ROUTES({ pathname }) 
      };
      const container = new NewBill({
        document: document,
        onNavigate: onNavigate,
        store: mockStore,
        localStorage: window.localStorage
      });

      const handleSubmitSpy = jest.spyOn(container, "handleSubmit");
      const updateSpy = jest.spyOn(mockStore.bills(), 'update');
      const form = document.querySelector(`form[data-testid="form-new-bill"]`);
      form.addEventListener('submit', handleSubmitSpy);
      fireEvent.submit(form);

      expect(handleSubmitSpy).toHaveBeenCalled();
      expect(updateSpy).toHaveBeenCalled();
    });
  });
});


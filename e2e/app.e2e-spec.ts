import { AlbinaAdminGuiPage } from './app.po';

describe('albina-admin-gui App', () => {
  let page: AlbinaAdminGuiPage;

  beforeEach(() => {
    page = new AlbinaAdminGuiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

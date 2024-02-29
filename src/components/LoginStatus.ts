class LoginStatus {
  static instance: LoginStatus;

  sessionInfo: string;

  static getInstance() {
    if (!LoginStatus.instance) {
      LoginStatus.instance = new LoginStatus();
    }
    return LoginStatus.instance;
  }
  private constructor() {
    this.sessionInfo = "";
  }
  public update(sessionInfo: string) {
    console.log("Update loginStatus:", sessionInfo);

    this.sessionInfo = sessionInfo;
    this.save();
  }
  public save() {
    console.log("Save loginStatus:", this);
    localStorage.setItem("loginSession", JSON.stringify(this));
  }

  public load() {
    const loginSession = localStorage.getItem("loginSession");
    if (loginSession) {
      console.log("Load loginStatus:", loginSession);
      const loginStatus = JSON.parse(loginSession);

      this.sessionInfo = loginStatus.sessionInfo;
    }
  }

  public dump() {
    console.log("Dump loginStatus:", this);
  }
}
export const loginStatus = LoginStatus.getInstance();

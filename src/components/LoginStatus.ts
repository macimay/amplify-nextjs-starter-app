class LoginStatus {
  static instance: LoginStatus;

  public isLogin: boolean;
  public activeTeamId: string;
  public activeTeamName: string;
  public userId: string;
  public userName: string;
  public sessionId: string;

  static getInstance() {
    if (!LoginStatus.instance) {
      LoginStatus.instance = new LoginStatus();
    }
    return LoginStatus.instance;
  }
  private constructor() {
    this.isLogin = false;
    this.activeTeamId = "";
    this.activeTeamName = "";
    this.userId = "";
    this.userName = "";
    this.sessionId = "";
  }

  public saveLoginStatus(status: {
    teamId: string;
    teamName: string;
    userId: string;
    userName: string;
    sessionId: string;
  }) {
    this.isLogin = true;
    this.activeTeamId = status.teamId;
    this.activeTeamName = status.teamName;

    this.userId = status.userId;
    this.userName = status.userName;
    this.sessionId = status.sessionId;

    if (typeof window! !== "undefined") {
      console.log("saveLoginStatus:window is defined");
      localStorage.setItem("loginStatus", JSON.stringify(loginStatus));
    } else {
      console.log("saveLoginStatus:window is undefined");
    }
  }
  public loadLoginStatus() {
    if (typeof window !== "undefined") {
      const status = localStorage.getItem("loginStatus");
      console.log("loadLoginStatus window is defined:", status);
      if (status) {
        const data = JSON.parse(status);

        this.activeTeamId = data.activeTeamId;
        this.activeTeamName = data.activeTeamName;
        this.userId = data.userId;
        this.userName = data.userName;
        this.sessionId = data.sessionId;
        this.isLogin = true;

        return true;
      }
    } else {
      console.log("window is undefined");

      return false;
    }
  }
}
export const loginStatus = LoginStatus.getInstance();

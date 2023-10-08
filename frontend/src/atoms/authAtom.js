import { atom } from "recoil";

// default value of authScreenAtom is login
const authScreenAtom = atom({
    key: "authScreenAtom",
    default: "login"
});

export default authScreenAtom;
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

export default function TestAuth() {
  const { user } = useContext(AuthContext);

  console.log("User dari AuthContext:", user);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Testing AuthContext</h2>
      <p>User sekarang: {JSON.stringify(user)}</p>
    </div>
  );
}

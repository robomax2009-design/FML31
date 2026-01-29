async function login() {
    const base = "https://stud.fml31.ru:5006";

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (!username || !password) {
        alert("No login or password!");
        return;
    }

    try {
        const resp = await fetch(`${base}/`, {
            method: "PROPFIND",
            headers: {
                "Authorization": "Basic " + btoa(`${username}:${password}`),
                "Depth": "0"
            }
        });

        if (resp.ok) {
            console.log("Login successful:", resp.status);
            sessionStorage.setItem("webdav_user", username);
            sessionStorage.setItem("webdav_auth", btoa(`${username}:${password}`));
            window.location.href = "../index.html";
        } else if (resp.status === 401) {
            alert("Authorization error: check your username or password");
        } else {
            alert(`Server error: ${resp.status}`);
        }

    } catch (error) {
        console.error("Network error:", error);
        alert("Failed to connect to the server. Possibly SSL or CORS issue.");
    }
}

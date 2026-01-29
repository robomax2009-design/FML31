(function () {
    function decodePayload(token) {
        try {
            const payload = token.split('.')[1];
            return JSON.parse(atob(payload));
        } catch {
            return null;
        }
    }

    const token = localStorage.getItem('jwt');

    if (!token) {
        window.jwtInfo = { authenticated: false };
        return;
    }

    const payload = decodePayload(token);

    if (!payload || !payload.pub_id) {
        window.jwtInfo = { authenticated: false };
        return;
    }

    window.jwtInfo = {
        authenticated: true,
        pub_id: payload.pub_id,
        uid: payload.uid,
        issuer: payload.iss
    };
})();

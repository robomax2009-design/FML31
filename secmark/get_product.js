async function getProductById(productId) {
    try {
        const encodedId = encodeURIComponent(productId);
        const url = `https://tbs-server-s7vy.onrender.com/secmark/get_product/?id=${encodedId}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Err:', error);
        return null;
    }
}

async function getProfileById(profileId) {
    try {
        const encodedId = encodeURIComponent(profileId);
        const url = `https://tbs-server-s7vy.onrender.com/secmark/get_profile/?pub_id=${encodedId}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Err:', error);
        return null;
    }
}

let data = {};
async function loadProductsByProfile(ids) {
    body = document.getElementById("list");
    
    const promises = ids.map(async (id) => {
        const product = await getProductById(id);
        return { id, product };
    });
    
    const results = await Promise.all(promises);
    
    results.forEach(({ id, product }) => {
        data[id] = product;
    });
    return data;
}
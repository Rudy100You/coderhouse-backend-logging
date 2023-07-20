const addProductToCart = async (cid,pid)=>{
  let response = await fetch(`localhost:4000/api/carts/${cid}/product/${pid}`, {
    method: 'POST',
  });
}
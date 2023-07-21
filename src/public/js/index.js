/*eslint-disable no-undef*/
const filter = document.getElementById("filterButton")

filter.addEventListener("click",()=>{
  const category = document.getElementById("searchBox").value
  const order = document.getElementById("dropdown1").value
  let query = "?"
  
  query += category  === ""? "" : `query={"category":"${category}"}` 

  if(query.length > 1)
   query += "&"
   
  query += order  === ""? "" : `sort=${order}}` 

  window.location.href += query.length > 1? query:""
})

/*eslint-disable no-undef*/

const addProductToCart = async (cid,pid)=>{
  await fetch(`localhost:4000/api/carts/${cid}/product/${pid}`, {
    method: 'POST'
  });
}
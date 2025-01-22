//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
//import './App.css'

// import { useState, useEffect, useRef } from 'react';

import { useState, useEffect } from 'react';
//import {bootstrap} from 'bootstrap';
import axios from 'axios';

function App() {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const apiPath = import.meta.env.VITE_API_PATH;
  
  const [formData, setFormData] = useState({
    username: "example@test.com",
    password: "example",
  });
  const [isAuth, setisAuth] = useState(false);

  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState([]);

  //const productModalRef = useRef(null);


  // useEffect(() => {
  //   const token = document.cookie.replace(
  //     /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
  //     "$1"
  //   );
  //   axios.defaults.headers.common.Authorization = token;
  //   productModalRef.current = new bootstrap.Modal('#productModal', {
  //     keyboard: false
  //   });
  //   checkAdmin();
  // }, []);

  // const checkAdmin = async () => {
  //   try {
  //     await axios.post(`${baseURL}/api/user/check`);
  //     setisAuth(true);
  //   } catch (err) {
  //     console.log(err.response.data.message);
  //   }
  // };


  useEffect(() =>{
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common['Authorization'] = token;
    checkLogin();
  },[]);
  
  const checkLogin = async() => {
    try{
      await axios.post(`${baseURL}/v2/api/user/check`);
      setisAuth(true);
      getProducts();
    }
    catch(err){
      console.error(err);
      setisAuth(false);
    }
    // axios.post(`${baseURL}/v2/api/user/check`)
    // .then(() => {
    //   alert('使用者已登入');
    // })
    // .catch(() => {
    //   console.error(err);
    //   setisAuth(false);
    // });
  };


  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };


  
  

  const getProducts = () => {
    axios.get(`${baseURL}/v2/api/${apiPath}/admin/products`)
      .then((res) => {
        setProducts(res.data.products);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseURL}/v2/admin/signin`, formData);
      const { token, expired } = response.data;
      document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
      axios.defaults.headers.common.Authorization = token;
      setisAuth(true);
    } catch (error) {
      alert("登入失敗: " + error.response.data.message);
      setisAuth(false);
    }
  };


  
  

  return (
    <>
      {isAuth ? (
        <div>
          <div className="container">
            <div className="text-end mt-4">
              <button className="btn btn-primary">建立新的產品</button>
            </div>
            <table className="table mt-4">
              <thead>
                <tr>
                  <th width="120">分類</th>
                  <th>產品名稱</th>
                  <th width="120">原價</th>
                  <th width="120">售價</th>
                  <th width="100">是否啟用</th>
                  <th width="120">編輯</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <th scope="row">{product.title}</th>
                    <td>{product.origin_price}</td>
                    <td>{product.price}</td>
                    <td>{product.is_enabled}</td>
                    <td>
                      <button
                        onClick={() => setTempProduct(product)}
                        className="btn btn-primary"
                        type="button"
                      >
                        查看細節
                      </button>
                      <div className="btn-group">
                        <button type="button" className="btn btn-outline-primary btn-sm">編輯</button>
                        <button type="button" className="btn btn-outline-danger btn-sm">刪除</button>
                      </div>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td></td>
                  <td></td>
                  <td className="text-end"></td>
                  <td className="text-end"></td>
                  <td>
                    <span className="text-success">啟用</span>
                    <span>未啟用</span>
                  </td>
                  <td>
                    <div className="btn-group">
                      <button type="button" className="btn btn-outline-primary btn-sm">
                        編輯
                      </button>
                      <button type="button" className="btn btn-outline-danger btn-sm">
                        刪除
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // <div className="container login">
        //   <div className="row justify-content-center">
        //     <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
        //     <div className="col-8">
        //       <form id="form" className="form-signin" onSubmit={handleSubmit}>
        //         <div className="form-floating mb-3">
        //           <input
        //             type="email"
        //             className="form-control"
        //             id="username"
        //             placeholder="name@example.com"
        //             value={formData.username}
        //             onChange={handleInputChange}
        //             required
        //             autoFocus
        //             />
        //           <label htmlFor="username">Email address</label>
        //         </div>
        //         <div className="form-floating">
        //           <input
        //             type="password"
        //             className="form-control"
        //             id="password"
        //             placeholder="Password"
        //             value={formData.password}
        //             onChange={handleInputChange}
        //             required
        //             />
        //           <label htmlFor="password">Password</label>
        //         </div>
        //         <button
        //           className="btn btn-lg btn-primary w-100 mt-3"
        //           type="submit"
        //           >
        //           登入
        //         </button>
        //       </form>
        //     </div>
        //   </div>
        //   <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
        // </div>
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
          <h1 className="mb-5">請先登入</h1>
          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            <div className="form-floating mb-3">
              <input name="username" type="email" value={formData.username} onChange={handleInputChange} className="form-control" id="username" placeholder="name@example.com" />
              <label htmlFor="username">Email address</label>
            </div>
            <div className="form-floating">
              <input name="password" type="password" value={formData.password} onChange={handleInputChange} className="form-control" id="password" placeholder="Password" />
              <label htmlFor="password">Password</label>
            </div>
            <button type='sumbit' onClick={handleSubmit} className="btn btn-primary">登入</button>
          </form>
          <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院s</p>
        </div>
      )}
      <div
        id="productModal"
        className="modal fade"
        tabIndex="-1"
        aria-labelledby="productModalLabel"
        aria-hidden="true"
        >
        <div className="modal-dialog modal-xl">
          <div className="modal-content border-0">
            <div className="modal-header bg-dark text-white">
              <h5 id="productModalLabel" className="modal-title">
                <span>新增產品</span>
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-sm-4">
                  <div className="mb-2">
                    <div className="mb-3">
                      <label htmlFor="imageUrl" className="form-label">
                        輸入圖片網址
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="請輸入圖片連結"
                        />
                    </div>
                    <img className="img-fluid" src="" alt="" />
                  </div>
                  <div>
                    <button className="btn btn-outline-primary btn-sm d-block w-100">
                      新增圖片
                    </button>
                  </div>
                  <div>
                    <button className="btn btn-outline-danger btn-sm d-block w-100">
                      刪除圖片
                    </button>
                  </div>
                </div>
                <div className="col-sm-8">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">標題</label>
                    <input
                      id="title"
                      type="text"
                      className="form-control"
                      placeholder="請輸入標題"
                      />
                  </div>

                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label htmlFor="category" className="form-label">分類</label>
                      <input
                        id="category"
                        type="text"
                        className="form-control"
                        placeholder="請輸入分類"
                        />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="unit" className="form-label">單位</label>
                      <input
                        id="unit"
                        type="text"
                        className="form-control"
                        placeholder="請輸入單位"
                        />
                    </div>
                  </div>

                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label htmlFor="origin_price" className="form-label">原價</label>
                      <input
                        id="origin_price"
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="請輸入原價"
                        />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="price" className="form-label">售價</label>
                      <input
                        id="price"
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="請輸入售價"
                        />
                    </div>
                  </div>
                  <hr />

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">產品描述</label>
                    <textarea
                      id="description"
                      className="form-control"
                      placeholder="請輸入產品描述"
                      ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="content" className="form-label">說明內容</label>
                    <textarea
                      id="content"
                      className="form-control"
                      placeholder="請輸入說明內容"
                      ></textarea>
                  </div>
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        id="is_enabled"
                        className="form-check-input"
                        type="checkbox"
                        />
                      <label className="form-check-label" htmlFor="is_enabled">
                        是否啟用
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                data-bs-dismiss="modal"
                >
                取消
              </button>
              <button type="button" className="btn btn-primary">確認</button>
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
}

export default App

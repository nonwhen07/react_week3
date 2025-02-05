import { useState, useEffect, useRef } from 'react';
import { Modal } from 'bootstrap';
import axios from 'axios';

function App() {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const apiPath = import.meta.env.VITE_API_PATH;
  
  const [account, setAccount] = useState({
    username: "example@test.com",
    password: "example",
  });
  const [isAuth, setisAuth] = useState(false);
  const [products, setProducts] = useState([]);
  //Modal 資料狀態的預設值
  const defaultModalState = {
    imageUrl: "",
    title: "",
    category: "",
    unit: "",
    origin_price: "",
    price: "",
    description: "",
    content: "",
    is_enabled: 0,
    imagesUrl: [""]
  };

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // setAccount({
    //   ...account,
    //   [name]: value
    // });
    setAccount((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = (e) =>{
    e.preventDefault();

    axios.post(`${baseURL}/v2/admin/signin`, account)  
    .then((res) => {
      const { token, expired } = res.data;
      document.cookie = `hexToken=${token}; userLanguage=en; userPreference=darkMode; expires=${new Date(expired)}`; // 設定 cookie
      axios.defaults.headers.common['Authorization'] = token;

      getProducts(); // 查詢商品資料列表
      setisAuth(true); // 設定登入狀態
    })
    .catch((err) => {
      console.error(err);
      alert('登入失敗');
    });
  };

  const checkLogin = () => {
    axios.post(`${baseURL}/v2/api/user/check`)
    .then(() => {
      //alert('使用者已登入');
      setisAuth(true);
      getProducts();
    })
    .catch((err) => {
      console.error(err);
      setisAuth(false);
    });
  };

  useEffect(() =>{
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common['Authorization'] = token;
    checkLogin();
  },[]);

  
  
  // const checkLogin = async() => {
  //   try{
  //     await axios.post(`${baseURL}/v2/api/user/check`);
  //     setisAuth(true);
  //     getProducts();
  //   }
  //   catch(err){
  //     console.error(err);
  //     setisAuth(false);
  //   }
  //   // axios.post(`${baseURL}/v2/api/user/check`)
  //   // .then(() => {
  //   //   alert('使用者已登入');
  //   // })
  //   // .catch(() => {
  //   //   console.error(err);
  //   //   setisAuth(false);
  //   // });
  // };

  const getProducts = () => {
    axios.get(`${baseURL}/v2/api/${apiPath}/admin/products`)
      .then((res) => {
        setProducts(res.data.products);
      })
      .catch((err) => {
        console.error(err);
      });
  };


  const productModalRef = useRef(null);
  const deleteModalRef = useRef(null);
  
  useEffect(() => {
    // new Modal(productModalRef.current, { backdrop: false });
    // Modal.getInstance(productModalRef.current);
    // new Modal(deleteModalRef.current, { backdrop: false });
    // Modal.getInstance(productModalRef.current);
    if (productModalRef.current) {
      new Modal(productModalRef.current, { backdrop: false });
    }
    if (deleteModalRef.current) {
      new Modal(deleteModalRef.current, { backdrop: false });
    }
  }, [productModalRef, deleteModalRef]);

  const handleOpenProductModal = () => {  
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.show();
  };

  const handleCloseProductModal = () => {  
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.hide();
  };


  const handleOpenDeleteModal = () => {  
    const modalInstance = Modal.getInstance(deleteModalRef.current);
    modalInstance.show();
  };

  const handleCloseDeleteModal = () => {  
    const modalInstance = Modal.getInstance(deleteModalRef.current);
    modalInstance.hide();
  };
  
  
  const [tempProduct, setTempProduct] = useState(defaultModalState);

  const handleModalInputChange = (e) =>{
    // const { value, name, checked, type } = e.target;
    // setTempProduct({
    //   ...tempProduct,
    //   [name]: type === 'checkbox' ? checked : value, //透過type判斷是否為checkbox，綁定 checkbox 的勾選狀態時，應透過 checked 屬性，而非 value
    // })
    const { name, value, checked, type } = e.target;
    setTempProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value, //透過type判斷是否為checkbox，綁定 checkbox 的勾選狀態時，應透過 checked 屬性，而非 value
    }));
  };

  return (
    <>
      {isAuth ? (
        <div className="container py-5">
          <div className="d-flex justify-content-between">
            <h2>產品列表</h2>
            <button className="btn btn-primary" onClick={handleOpenProductModal}>新增產品</button>
          </div>
          <table className="table mt-4">
            <thead>
              <tr>
                <th width="120">分類</th>
                <th>產品名稱</th>
                <th width="120">原價</th>
                <th width="120">售價</th>
                <th width="100">是否啟用</th>
                <th width="120"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <th scope="row">{product.category}</th>
                  <td>{product.title}</td>
                  <td>{product.origin_price}</td>
                  <td>{product.price}</td>
                  <td>{product.is_enabled}</td>
                  {/* <td>
                    <button
                      onClick={() => setTempProduct(product)}
                      className="btn btn-primary"
                      type="button"
                    >
                      查看細節
                    </button>
                  </td> */}
                  <td>
                    <div className="btn-group">
                      <button type="button" onClick={handleOpenProductModal} className="btn btn-outline-primary btn-sm">編輯</button>
                      <button type="button" onClick={handleOpenDeleteModal} className="btn btn-outline-danger btn-sm">刪除</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        
      ) : (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
          <h1 className="mb-5">請先登入</h1>
          <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
            <div className="form-floating mb-3">
              <input
                name="username"
                type="email"
                value={account.username || ""}
                onChange={handleInputChange}
                className="form-control"
                id="username"
                placeholder="example@test.com"
              />
              <label htmlFor="username">Email address</label>
            </div>
            <div className="form-floating">
              <input
                name="password"
                type="password"
                value={account.password || ""}
                onChange={handleInputChange}
                className="form-control"
                id="password"
                placeholder="example"
              />
              <label htmlFor="password">Password</label>
            </div>
            <button type="submit" className="btn btn-primary">
              登入
            </button>
          </form>
        </div>
      )}


      <div id="productModal" ref={productModalRef} className="modal" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content border-0 shadow">
            <div className="modal-header border-bottom">
              <h5 className="modal-title fs-4">新增產品</h5>
              <button type="button" onClick={handleCloseProductModal} className="btn-close" aria-label="Close"></button>
            </div>
            <div className="modal-body p-4">
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="mb-4">
                    <label htmlFor="primary-image" className="form-label">
                      主圖
                    </label>
                    <div className="input-group">
                      <input
                        value={tempProduct.imageUrl || ""}
                        onChange={handleModalInputChange}
                        name="imageUrl"
                        type="text"
                        id="primary-image"
                        className="form-control"
                        placeholder="請輸入圖片連結"
                      />
                    </div>
                    <img
                      src={tempProduct.imageUrl}
                      alt=""
                      className="img-fluid"
                    />
                  </div>
                  {/* 副圖 */}
                  <div className="border border-2 border-dashed rounded-3 p-3">
                    {tempProduct.imagesUrl?.map((image, index) => (
                      <div key={index} className="mb-2">
                        <label
                          htmlFor={`imagesUrl-${index + 1}`}
                          className="form-label"
                        >
                          副圖 {index + 1}
                        </label>
                        <input
                          id={`imagesUrl-${index + 1}`}
                          type="text"
                          placeholder={`圖片網址 ${index + 1}`}
                          className="form-control mb-2"
                        />
                        {image && (
                          <img
                            src={image}
                            alt={`副圖 ${index + 1}`}
                            className="img-fluid mb-2"
                          />
                        )}
                      </div>
                    ))}

                  </div>
                </div>

                <div className="col-md-8">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      標題
                    </label>
                    <input
                      value={tempProduct.title}
                      onChange={handleModalInputChange}
                      name="title"
                      id="title"
                      type="text"
                      className="form-control"
                      placeholder="請輸入標題"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="category" className="form-label">
                      分類
                    </label>
                    <input
                      value={tempProduct.category}
                      onChange={handleModalInputChange}
                      name="category"
                      id="category"
                      type="text"
                      className="form-control"
                      placeholder="請輸入分類"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="unit" className="form-label">
                      單位
                    </label>
                    <input
                      value={tempProduct.unit}
                      onChange={handleModalInputChange}
                      name="unit"
                      id="unit"
                      type="text"
                      className="form-control"
                      placeholder="請輸入單位"
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label htmlFor="origin_price" className="form-label">
                        原價
                      </label>
                      <input
                        value={tempProduct.origin_price}
                        onChange={handleModalInputChange}
                        name="origin_price"
                        id="origin_price"
                        type="number"
                        className="form-control"
                        placeholder="請輸入原價"
                      />
                    </div>
                    <div className="col-6">
                      <label htmlFor="price" className="form-label">
                        售價
                      </label>
                      <input
                        value={tempProduct.price}
                        onChange={handleModalInputChange}
                        name="price"
                        id="price"
                        type="number"
                        className="form-control"
                        placeholder="請輸入售價"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      產品描述
                    </label>
                    <textarea
                      value={tempProduct.description}
                      onChange={handleModalInputChange}
                      name="description"
                      id="description"
                      className="form-control"
                      rows={4}
                      placeholder="請輸入產品描述"
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="content" className="form-label">
                      說明內容
                    </label>
                    <textarea
                      value={tempProduct.content}
                      onChange={handleModalInputChange}
                      name="content"
                      id="content"
                      className="form-control"
                      rows={4}
                      placeholder="請輸入說明內容"
                    ></textarea>
                  </div>

                  <div className="form-check">
                    <input
                      checked={Boolean(tempProduct.is_enabled)}
                      onChange={handleModalInputChange}
                      name="is_enabled"
                      type="checkbox"
                      className="form-check-input"
                      id="isEnabled"
                    />
                    <label className="form-check-label" htmlFor="isEnabled">
                      是否啟用
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer border-top bg-light">
              <button type="button" onClick={handleCloseProductModal} className="btn btn-secondary">
                取消
              </button>
              <button type="button" className="btn btn-primary">
                確認
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade" ref={deleteModalRef}
        id="delProductModal"
        tabIndex="-1"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">刪除產品</h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              你是否要刪除 
              <span className="text-danger fw-bold">{tempProduct.title}</span>
            </div>
            <div className="modal-footer">
              <button
                type="button" onClick={handleCloseDeleteModal}
                className="btn btn-secondary"
              >
                取消
              </button>
              <button type="button" className="btn btn-danger">
                刪除
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App

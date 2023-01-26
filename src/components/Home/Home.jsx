import { createContext, useState } from "react";
import Korzinka from "../Korzinka/Korzinka";
import Banner from "../Banner/Banner";
import CardComponent from "../CardComponent/CardComponent";
import { useDispatch, useSelector } from "react-redux";
import Modal from "@mui/material/Modal";
import Order from "../Order/Order";
import { addOrderAction, getProductsAction } from "../../redux/productReducer";
import axios from "axios";
import { useEffect } from "react";

export const Context = createContext(null);

const Home = () => {
  const data = useSelector((state) => state.products.data);
  // const orders = useSelector((state) => state.products.orders);
  const [currentProduct, setcurrentProduct] = useState({});
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch = useDispatch();

  const formatCategories = (arr) => {
    const categories = arr.reduce(
      (total, v) =>
        total.includes(v.category) ? total : [...total, v.category],
      []
    );
    return categories.reduce((total, category) => {
      return [
        ...total,
        { category, products: arr.filter((e) => e.category === category) },
      ];
    }, []);
  };

  const onProductButtonClick = (id) => {
    handleOpen();
    // const products = data.reduce((total, el) => [...total, ...el.products], []);
    setcurrentProduct(data.find((el) => el.id === id));
  };

  const addToOrders = (currentProduct, count) => {
    const newProduct = {
      ...currentProduct,
      count,
      totalSum: currentProduct.price * count,
    };
    dispatch(addOrderAction(newProduct));
    handleClose();
  };

  useEffect(() => {
    axios
      .get("https://fakestoreapi.com/products")
      .then((response) => {
        console.log();
        dispatch(getProductsAction(response.data));
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

  const states = {
    handleOpen,
    onProductButtonClick,
    addToOrders,
  };

  const getting = formatCategories(data);
  return (
    <>
      <Context.Provider value={states}>
        {/* <SideBar /> */}

        <Banner />
        {getting?.map((el) => (
          <CardComponent
            key={el?.category}
            category={el?.category}
            products={el?.products}
          />
        ))}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Order
            product={currentProduct}
            onClickClose={handleClose}
            addToOrders={addToOrders}
          />
        </Modal>
      </Context.Provider>
    </>
  );
};

export default Home;

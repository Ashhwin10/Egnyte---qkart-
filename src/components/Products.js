import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import { Typography } from "@mui/material";
import Cart, { generateCartItemsFrom } from "./Cart";
import "./Cart.css";
import { Warning } from "@mui/icons-material";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [products, setProducts] = useState([]); //all products list
  const [loading, setLoading] = useState(false);
  const [cartItemList, setCartItemList] = useState([]); //cart list
  const [cartItemId, setCartItemId] = useState([]);
  let token = localStorage.getItem("token");

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    setLoading(true);
    try {
      const url = `${config.endpoint}/products`;
      let response = await axios.get(url);
      setProducts(response.data);
      console.log(response.data);
      setLoading(false);
      return response.data;
    } catch (e) {
      // setLoading(false);
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
          { variant: "error" }
        );
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    let url = `${config.endpoint}/products/search?value=${text}`;
    try {
      let search = await axios.get(url);
      setProducts(search.data);
    } catch (e) {
      if (e.response.status === 404) {
        setProducts("empty");
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    let newtimeout;
    clearTimeout(newtimeout);
    newtimeout = setTimeout(() => {
      performSearch(event.target.value);
    }, debounceTimeout);
  };

  useEffect(() => {
    // const defaultFunction = async () => {
    performAPICall();

    //  defaultFunction();
  }, []);

  useEffect(() => {
    // if (token) {
    // console.log(token)
    fetchCart(token)
      .then((result) => {
        return generateCartItemsFrom(result, products);
      })
      .then((cartItems) => {
        return setCartItemList(cartItems);
      });
    // }
  }, [products]);

  // useEffect(() => {
  //   console.log("itemList.pdt", cartItemList);
  // }, [cartItemList]);

  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */

  const fetchCart = async (token) => {
    // console.log("2")
    if (!token) return;
    const url = `${config.endpoint}/cart`; 
    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // id[]=hasjdhaksjhdkjhask
      // console.log("fetchcart", products);
      // let cartIdList = response.data;
      // setCartItemId(cartIdList);
      // const cardList = generateCartItemsFrom(cartIdList, products);
      // console.log("cardList", cardList);
      // []={products}
      // setCartItemList(cardList);
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    for (let i = 0; i < items.length; i++) {
      if (items[i]._id === productId) {
        return true;
      }
    }
    return false;
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if(!token){
      enqueueSnackbar("Login to add item to the Cart",{variant:"Warning"})
      return;
    }
    
    if(options.preventDuplicate && isItemInCart(items,productId)){
      enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item.",{variant:"warning"});
      return;
    }
   
    
    try {
      const res = await axios.post(
        `${config.endpoint}/cart`,
        { productId, qty },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const nCartItemList = generateCartItemsFrom(res.data, products);
      setCartItemId(res.data);
      setCartItemList(nCartItemList);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
          className="search-desktop"
          fullWidth
          size="small"
          sx={{ width: "35%" }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          onChange={(event) => debounceSearch(event, 500)}
        />
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(event) => debounceSearch(event, 500)}
      />
      <Grid container>
        <Grid
          item
          // container
          // direction="row"
          // justifyContent="center"
          // alignItems="center"
          xs
          md
        >
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>
          {/* <ProductCard /> */}

          <Grid container>
            {loading === true ? (
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
              >
                <CircularProgress size={25} />
                <Typography gutterBottom variant="p" component="div">
                  Loading Products...
                </Typography>
              </Box>
            ) : (
              <Grid
                container
                item
                spacing={1}
                direction="row"
                justifyContent="center"
                alignItems="center"
                my={3}
              >
                {products !== "empty" ? (
                  products.map((item) => (
                    <Grid item key={item._id} xs={6} md={3}>
                      <ProductCard
                        product={item}
                        handleAddToCart={async () => {
                          const token = localStorage.getItem("token");
                          await addToCart(
                            token,
                            cartItemList,
                            products,
                            item._id,
                            1,
                            { preventDuplicate: true }
                          );
                        }}
                      />
                    </Grid>
                  ))
                ) : (
                  <h3>No products found</h3>
                )}
              </Grid>
            )}
          </Grid>
        </Grid>
        {localStorage.token && (
          <Grid
            container
            item
            className="product-grid"
            xs={12}
            md={3}
            sx={{ border: `1px solid black`, backgroundColor: `#E9F5E1` }}
          >
            <Cart
              products={products}
              items={cartItemList}
              handleQuantity={addToCart}
            />
          </Grid>
        )}
      </Grid>

      <Footer />
    </div>
  );
};
// return(<productCard/>)

export default Products;

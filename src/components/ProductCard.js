import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";


const ProductCard = ({product, handleAddToCart}) => {
  return (
    <Card className="card">
      <CardMedia
          component="img"
          image={product.image}
          alt={product.name}
        />
        <CardContent>
        <Typography gutterBottom variant="h5" component="div">
           {product.name}
          </Typography>
          <Typography gutterBottom variant="h5" component="div">
          ${product.cost}
          </Typography>
          <Rating value ={product.rating} readOnly/>

        </CardContent>
        <CardActions>
          <Button className="card-button" fullWidth variant="contained" onClick={handleAddToCart}>
            <AddShoppingCartOutlined/>ADD TO CART
          </Button>
        </CardActions>
      
    </Card>
    
  );
};

export default ProductCard;

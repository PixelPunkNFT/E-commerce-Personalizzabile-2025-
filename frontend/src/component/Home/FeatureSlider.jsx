import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, A11y, Autoplay } from "swiper";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import "./FeatureSlider.css";
import { Link } from "react-router-dom";
import {
  dispalyMoney,
  generateDiscountedPrice,
} from "../DisplayMoney/DisplayMoney";

const FeaturedSlider = ({ products }) => {
  return (
    <Swiper
      modules={[EffectCoverflow, Pagination, A11y, Autoplay]}
      loop={true}
      speed={500}
      spaceBetween={50} // Default space between slides
      slidesPerView={1} // Default slides per view
      pagination={{ clickable: true }}
      effect={"coverflow"}
      centeredSlides={true}
      coverflowEffect={{
        rotate: 0,
        stretch: 10,
        depth: 50,
        modifier: 3,
        slideShadows: false,
      }}
      autoplay={{
        delay: 3500,
        disableOnInteraction: false,
      }}
      breakpoints={{
        320: {
          slidesPerView: 1, // For smaller devices
          spaceBetween: 10,
        },
        480: {
          slidesPerView: 1, // Slightly larger devices
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 2, // Tablets
          spaceBetween: 30,
        },
        1024: {
          slidesPerView: 3, // Small desktops
          spaceBetween: 40,
        },
        1200: {
          slidesPerView: 4, // Larger desktops
          spaceBetween: 50,
        },
      }}
      className="featured_swiper"
    >
      {products.map((product) => {
        const { _id, images, name, price } = product;
        let newPrice = generateDiscountedPrice(price);
        newPrice = dispalyMoney(newPrice);
        const oldPrice = dispalyMoney(price);

        return (
          <SwiperSlide key={_id} className="featured_slides">
            <Link
              to={`/product/${_id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="featured_title">{name}</div>
              <figure className="featured_img">
                <img src={images[0].url} alt={name} />
              </figure>
              <h2 className="products_price">
                <span className="final_price">{newPrice}</span> &nbsp;
                <small>
                  <del className="old_price">{oldPrice}</del>
                </small>
              </h2>
            </Link>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default FeaturedSlider;

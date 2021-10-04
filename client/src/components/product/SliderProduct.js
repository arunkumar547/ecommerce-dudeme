import React from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Container, Card, Row, Col } from "react-bootstrap";
import { Link } from 'react-router-dom'

const SliderProduct = ({ products }) => {

  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2
  };
  var settings1 = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2
  };
  var settings2 = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 2
  };


  return (
    <Container>
      {/* <div className="clearfix mt-5 mb-2">
        <h4 className="float-left">Now Playing</h4>
        <Link className="float-right text-uppercase" to="/">
          see all
        </Link>
      </div> */}
      {window.innerWidth>800 && <Slider {...settings1}>
        {products.map(function (product) {
          return (
            <React.Fragment>
              <Link to={`/product/${product._id}`}>
                <Col>
                  <Card>
                    <Card.Img
                      variant="top"
                      src={product.images[0].url}
                    />
                    <Card.Body>
                      <span>{product.name}</span>
                    </Card.Body>
                  </Card>
                </Col>
              </Link>
            </React.Fragment>
          );
        })}
      </Slider> 
      }
      {window.innerWidth<800 && window.innerWidth>500 && <Slider {...settings1}>
      {products.map(function (product) {
        return (
          <React.Fragment>
            <Link to={`/product/${product._id}`}>
              <Col>
                <Card>
                  <Card.Img
                    variant="top"
                    src={product.images[0].url}
                  />
                  <Card.Body>
                    <span>{product.name}</span>
                  </Card.Body>
                </Card>
              </Col>
            </Link>
          </React.Fragment>
        );
      })}
    </Slider>
      }
      {
        window.innerWidth <500 && <Slider {...settings2}>
        {products.map(function (product) {
          return (
            <React.Fragment>
              <Link to={`/product/${product._id}`}>
                <Col>
                  <Card>
                    <Card.Img
                      variant="top"
                      src={product.images[0].url}
                    />
                    <Card.Body>
                      <span>{product.name}</span>
                    </Card.Body>
                  </Card>
                </Col>
              </Link>
            </React.Fragment>
          );
        })}
      </Slider> 
      }
    </Container>
  )
}

export default SliderProduct

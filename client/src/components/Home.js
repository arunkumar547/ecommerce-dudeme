import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import MetaData from './layout/MetaData'
import { getProducts } from '../actions/productAction'
import Product from './product/Product'
import Loader from './layout/Loader'
import { useAlert } from 'react-alert'
import Pagination from 'react-js-pagination'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
// import SliderProduct from './product/SliderProduct'

const { createSliderWithTooltip } = Slider
const Range = createSliderWithTooltip(Slider.Range)

const Home = ({ match }) => {

    const [currentPage, setCurrentPage] = useState(1)
    const [price, setPrice] = useState([1, 1000])
    const [category, setCategory] = useState('')
    const [rating, setRating] = useState(0)

    const categories = [
        'Electronics',
        'Shirts',
        'Cameras',
        'Accessories',
        'Headphones',
        'Food',
        'Books',
        'Clothes/Shoes',
        'Beauty/Health',
        'Sports'
    ]

    const alert = useAlert()
    const dispatch = useDispatch()

    const { loading, products, error, productsCount, resPerPage, filteredProductsCount } = useSelector(state => state.products)

    const keyword = match.params.keyword;

    useEffect(() => {

        if (error) {
            return alert.error(error)
        }

        dispatch(getProducts(keyword, currentPage, price, category, rating))

    }, [dispatch, alert, error, currentPage, keyword, price, category, rating])

    function setCurrentPageNo(pageNumber) {
        setCurrentPage(pageNumber)
    }

    let count = productsCount
    if (keyword) {
        count = filteredProductsCount
    }

    // let fullSleeve = products.filter(product => (
    //     product.category === "Shirts"
    // ))

    // let halfSleeve = products.filter(product => (
    //     product.category === "Food"
    // ))

    return (
        <Fragment>
            {loading ? <Loader /> : (
                <Fragment>
                    <MetaData title={'Buy Best Products Online'} />
                    {!keyword ? <h1 id="products_heading">Latest Products</h1> :
                        <h1 id="products_heading">Searched Products</h1>}

                    {/* {!keyword && <div className="container">
                        <div className="row">
                            <div className="col-12 text-center pt-3">
                                <h4>Geek T-Shirts For Men & Women</h4>
                                <hr></hr>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 pt-3">
                                <img className="img-fluid" src="/images/half_sleeve_1.jpg" />
                            </div>
                            <div className="col-md-6 pt-3 pl-4">
                                <img className="img-fluid" src="/images/full_sleeve.jpg" />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-12 text-center pt-3">
                                <h4>Pocket Prints</h4>
                                <hr></hr>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 pt-3">
                                <img className="img-fluid" src="/images/pp_halfsleeve.PNG" />
                            </div>
                            <div className="col-md-6 pt-3">
                                <img className="img-fluid" src="/images/pp_fullsleeve.PNG" />
                            </div>
                        </div>
                    </div>} */}

                    <section id="products" className="container mt-5">
                        <div className="row">
                            {keyword ? (
                                <Fragment>
                                    <div className="col-6 col-md-3 mt-5 mb-5">
                                        <div className="px-5">
                                            <Range
                                                marks={{
                                                    1: `Rs1`,
                                                    1000: `Rs1000`
                                                }}
                                                min={1}
                                                max={1000}
                                                defaultValue={[1, 1000]}
                                                tipFormatter={value => `Rs${value}`}
                                                tipProps={{
                                                    placement: "top",
                                                    visible: true
                                                }}
                                                value={price}
                                                onChange={price => setPrice(price)}
                                            />
                                            <hr className="my-5" />
                                            <div className="mt-5">
                                                <h4 className="mb-3">Categories</h4>
                                                <ul className="pl-0">
                                                    {categories.map(category => (<li style={{ cursor: 'pointer', listStyleType: 'none' }} key={category} onClick={() => setCategory(category)}>
                                                        {category}
                                                    </li>))}
                                                </ul>
                                            </div>

                                            <hr className="my-3" />
                                            <div className="mt-5">
                                                <h4 className="mb-3">Ratings</h4>
                                                <ul className="pl-0">
                                                    {[5, 4, 3, 2, 1].map(star => (<li style={{ cursor: 'pointer', listStyleType: 'none' }} key={star} onClick={() => setRating(star)}>
                                                        <div className="rating-outer">
                                                            <div className="rating-inner"
                                                                style={{
                                                                    width: `${star * 20}%`
                                                                }}>
                                                            </div>
                                                        </div>
                                                    </li>))}
                                                </ul>
                                            </div>

                                        </div>
                                    </div>

                                    <div className="col-6 col-md-9">
                                        <div className="row">
                                            {
                                                products && products.map(product => (
                                                    <Product key={product._id} product={product} col={4} />
                                                ))
                                            }
                                            {!products.length && <h2>No Products Found</h2>}
                                        </div>
                                    </div>
                                </Fragment>
                            ) : (
                                products && products.map(product => (
                                    <Product key={product._id} product={product} col={3} />
                                ))
                            )}
                        </div>
                    </section>

                    {resPerPage <= count && (
                        <div className="d-flex justify-content-center mt-5">
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={resPerPage}
                                totalItemsCount={keyword ? filteredProductsCount : productsCount}
                                onChange={setCurrentPageNo}
                                nextPageText={'next'}
                                prevPageText={'prev'}
                                firstPageText={'first'}
                                lastPageText={'last'}
                                itemClass='page-item'
                                linkClass='page-link'
                            />
                        </div>
                    )}

                    {/* <h2>Category Full</h2>
                    {fullSleeve && <SliderProduct products={fullSleeve} />}

                    <h2>Category Half</h2>
                    {halfSleeve && <SliderProduct products={halfSleeve} />} */}
                </Fragment>
            )}
        </Fragment>
    )
}

export default Home

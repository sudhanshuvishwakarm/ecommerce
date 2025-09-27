'use client'
import AliceCarousel from 'react-alice-carousel'
import 'react-alice-carousel/lib/alice-carousel.css'

const Maincarousel = () => {
    let Maincarouseldata = [
        "https://m.media-amazon.com/images/G/31/img24/Fashion/Event/JanART/Eventpage/AF/top/heros/V1/V2/Footwear_3000x800_1._SX3000_QL85_FMpng_.png", "https://m.media-amazon.com/images/G/31/img23/Fashion/AF/JanART/tophero/Watches-smartwatches_3000x800_9._SX3000_QL85_FMpng_.png", "https://m.media-amazon.com/images/G/31/img23/Fashion/AF/JanART/tophero/Sunglasses-frames_3000x800_19._SX3000_QL85_FMpng_.png",
        "https://m.media-amazon.com/images/G/31/img24/Fashion/Event/JanART/Eventpage/AF/top/heros/V1/V2/Luggage-backpacks_3000x800_21._SX3000_QL85_FMpng_.png",
        "https://m.media-amazon.com/images/G/31/img24/Fashion/Event/JanART/Eventpage/AF/top/heros/V1/V2/Clothing-shoes-more_3000x800_5._SX3000_QL85_FMpng_.png",
        "https://m.media-amazon.com/images/G/31/img23/Fashion/AF/JanART/top/hero/1/v1/Jewellery_3000x800._SX3000_QL85_FMpng_.png",
        "https://m.media-amazon.com/images/G/31/img24/Fashion/Event/JanART/Eventpage/AF/top/heros/V1/V2/Clothing-shoes-more_3000x800_5._SX3000_QL85_FMpng_.png"
    ]
    const handleOnDragStart = (e) => e.preventDefault()
    return (
        <div className='relative z-10'>
            <AliceCarousel mouseTrackingEnabled
                autoPlay
                infinite
                duration={3000}
                autoPlayInterval={3000}
                buttonsDisabled
            >
                {
                    Maincarouseldata.map((event, index) => {
                        return (
                            <img key={index} onDragStart={handleOnDragStart} src={event} alt="" />
                        )
                    })
                }
            </AliceCarousel>
        </div>
    )
}

export default Maincarousel

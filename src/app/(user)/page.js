import Homecarousel from '../../components/Home/Homecarousel.jsx'
import Maincarousel from '../../components/Home/Maincarousel.jsx'

const Homepage = () => {
  let carousalData = [
    {
      category1: 'men',
      category2: 'clothing',
      category3: 'shirts',
      heading:'Top Deals on Men\'s Shirts'
    },
    {
      category1: 'women',
      category2: 'clothing',
      category3: 'tops',
      heading:'Top Deals on Women\'s Tops'
    }
  ]
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Carousel Section */}
      <div className="w-full">
        <Maincarousel />
      </div>

      {/* Product Carousels Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {carousalData.map((data, index) => (
          <Homecarousel key={index} carousalData={data} />
        ))}
      </div>
    </div>
  )
}

export default Homepage// import Homecarousel from '../../components/Home/Homecarousel.jsx'
// import Maincarousel from '../../components/Home/Maincarousel.jsx'


// const Homepage = () => {
//   let carousalData = [
//     {
//       category1: 'men',
//       category2: 'clothing',
//       category3: 'shirts',
//       heading:'Top Deals on Men\'s Shirts'
//     },
//     {
//       category1: 'women',
//       category2: 'clothing',
//       category3: 'tops',
//       heading:'Top Deals on Women\'s Tops'
//     }
//   ]
//   return (
//     <div >

//       <div>
//         <Maincarousel />
//       </div>

//       <div>
//         {carousalData.map((data, index) => (
//           <Homecarousel key={index} carousalData={data} />
//         ))
//         }
//       </div>

//     </div>
//   )
// }

// export default Homepage
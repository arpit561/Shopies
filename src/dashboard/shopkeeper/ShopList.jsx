import React, { useEffect, useState } from 'react'
import axios from 'axios'

const ShopList = () => {
  const [shops, setShops] = useState([])

  useEffect(() => {
    axios.get("/api/shop/all")
      .then(res => setShops(res.data.shops))
      .catch(err => console.error("Error fetching shops", err))
  }, [])

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">All Shops</h2>
      {shops.length === 0 ? (
        <p>No shops available.</p>
      ) : (
        <ul className="space-y-2">
          {shops.map((shop) => (
            <li key={shop._id} className="p-4 border rounded">
              <h3 className="text-lg">{shop.shopName}</h3>
              <p>{shop.address}</p>
              <p className="text-sm text-gray-500">Owner: {shop.owner?.name}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ShopList

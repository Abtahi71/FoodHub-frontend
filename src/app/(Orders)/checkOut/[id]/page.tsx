'use client'


import { useQuery } from "@tanstack/react-query";

import { useEffect, useState } from "react";
import { GetCartAction } from "../../_actions/order.action";
import OrderInfo from "../../_components/OrderInfo";

type CartItem = {
  providerMeal: {
    meal: {
      name: string;
      description: string;
    };
    provider: {
      restaurantName: string;
    };
    price: number;
      image:string;
  };
  quantity: number;
};

export default function CheckOut() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const {data:cart,isLoading} = useQuery({
    queryKey: ["cart"],
    queryFn: GetCartAction
  })

  useEffect(() => {
    if (!cart?.data?.cart) return;


      setItems(cart.data.cart.items);
      console.log('sdbbfudbofiabdoifboadifoidbfoibadfoidbfodiofbaodibfiodbfoaikdbfoakdbif',cart.data.cart.items);
      setTotalAmount(cart.data.totalAmount);
      setId(cart.data.cart.id);
    
  }, [cart]);

     


  console.log(id);
  return (
    <div className="flex justify-between">
        <div className="w-2/3 ml-20">
            <OrderInfo/>
        </div>
      {items.length > 0 && <div className="border border-gray-600 rounded-b-lg  pl-2 pb-5 mr-10 h-fit">
        {items.map((item, index) => (
          <div key={index} className="border-b flex gap-8 justify-between">
            <div className=" pb-3 mb-3">
              <h3 className="font-medium">{item.providerMeal.meal.name}</h3>

              <p className="text-sm text-gray-900 font-medium">
                From:
                {item.providerMeal.provider.restaurantName}
              </p>

              <p className="text-sm  font-medium">
                Price: {item.providerMeal.price} ৳
              </p>

              <p className="text-sm font-medium">Quantity: {item.quantity}</p>

              <p className="text-sm font-bold text-green-800">
                Subtotal: {item.providerMeal.price * item.quantity} ৳
              </p>
            </div>
            <div>
              <img src={item.providerMeal.image} className="w-25 rounded-bl-xl" alt="" />
            </div>
          </div>
        ))}

        {items.length > 0 && (
          <div className="mt-4">
            <p className="font-semibold">Total: {totalAmount} ৳</p>
          </div>
        )}
      </div>}
    </div>
  );
}

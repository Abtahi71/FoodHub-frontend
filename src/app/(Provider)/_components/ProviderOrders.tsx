
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  User,
  MapPin,
  Phone,
  Mail,
  DollarSign,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getOrdersAction, updateOrderStatusAction } from "@/app/(Provider)/_actions/providerActions";


type OrderItem = {
  Providermeal: {
    meal: {
      name: string;
      description: string;
    };
  };
};

type Order = {
  id: string;
  status: string;
  totalAmount: number;
  deliveryAddress: string;
  contact: string;
  items: OrderItem[];
  customer: {
    name: string;
    email: string;
  };
};

const STATUS_OPTIONS = [
  "PENDING",
  "PREPARING",
  "ON_THE_WAY",
  "DELIVERED",
  "CANCELLED",
];

export default function ProviderOrders({ id }: { id: string }) {

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const queryClient = useQueryClient()

  const {mutate: updateTheOrderStatus} = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      updateOrderStatusAction(orderId, status),
    onSuccess: (status) => {
      toast.success(`Order status updated`);
      queryClient.invalidateQueries({ queryKey: ["orders", id] });
    },
    onError:()=>{
      toast.error("Failed to update status");
    }
  })

  const {data:orderInfo,isLoading}=useQuery({
    queryKey:["orders",id],
    queryFn:()=>getOrdersAction(id)
  })
  if(isLoading){
    return (
      <div className="text-center py-8">
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  console.log("THIS IS THE ORDERS FROM THE PROVIDER",orderInfo);

  const orders = orderInfo?.data





  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      PREPARING: "bg-blue-100 text-blue-800 border-blue-200",
      READY: "bg-purple-100 text-purple-800 border-purple-200",
      ON_THE_WAY: "bg-indigo-100 text-indigo-800 border-indigo-200",
      DELIVERED: "bg-green-100 text-green-800 border-green-200",
      CANCELLED: "bg-red-100 text-red-800 border-red-200",
    };
    return (
      colors[status as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  if (orders?.length===0) {
    return (
      <div className="text-center py-8">
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600">No orders yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Orders ({orders?.length})</h2>

      {orders?.map((order:any, idx:any) => (
        <Card key={idx} className="overflow-hidden">
          <CardHeader className="bg-gray-50 p-4 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Status Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className={`gap-2 ${getStatusColor(order.status)}`}
                    disabled={updatingId === order.id}
                  >
                    {order.status}
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {STATUS_OPTIONS.map((status) => (
                    <DropdownMenuItem
                      key={status}
                      onClick={() => updateTheOrderStatus({orderId:order.id, status})}
                      disabled={
                        status === order.status || updatingId === order.id
                      }
                      className="cursor-pointer"
                    >
                      {status}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <span className="font-semibold flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                {order.totalAmount}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {order.items.length} {order.items.length === 1 ? "item" : "items"}
            </span>
          </CardHeader>

          <CardContent className="p-4 space-y-3">
            {/* Customer */}
            <div className="flex items-start gap-2 text-sm">
              <User className="w-4 h-4 mt-0.5 text-gray-500" />
              <div>
                <span className="font-medium">{order.customer.name}</span>
                <div className="flex items-center gap-1 text-gray-600 text-xs">
                  <Mail className="w-3 h-3" />
                  {order.customer.email}
                </div>
              </div>
            </div>

            {/* Delivery */}
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="w-4 h-4 mt-0.5 text-gray-500" />
              <span>{order.deliveryAddress}</span>
            </div>

            <div className="flex items-start gap-2 text-sm">
              <Phone className="w-4 h-4 mt-0.5 text-gray-500" />
              <span>{order.contact}</span>
            </div>

            {/* Items */}
            {order.items.length > 0 && (
              <div className="mt-2 pt-2 border-t">
                <p className="text-xs font-medium text-gray-500 mb-1">ITEMS:</p>
                <div className="space-y-1">
                  {order.items.slice(0, 2).map((item:any, i:any) => (
                    <p key={i} className="text-sm">
                      • {item.Providermeal.meal.name}
                    </p>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-xs text-gray-500">
                      +{order.items.length - 2} more items
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

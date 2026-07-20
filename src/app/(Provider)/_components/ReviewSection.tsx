"use client";

import { Star, User, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllReviewsAction,
  getMyReviewsAction,
  reviewProviderAction,
} from "@/_actions/reviews.action";

export default function ReviewSection({ id }: { id: string }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const queryClient = useQueryClient();

  const { data: myReview, isLoading } = useQuery({
    queryKey: ["myReview", id],
    queryFn: () => getMyReviewsAction(id),
  });

  const { data: allReview, isLoading: isReviewLoading } = useQuery({
    queryKey: ["allReview", id],
    queryFn: () => getAllReviewsAction(id),
  });

  const reviews = allReview?.data || [];

  const { mutate: reviewProvider } = useMutation({
    mutationFn: ({
      id,
      rating,
      comment,
    }: {
      id: string;
      rating?: number;
      comment?: string;
    }) => reviewProviderAction(id, rating, comment),
    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.invalidateQueries({
        queryKey: ["myReview", id],
      });

      queryClient.invalidateQueries({
        queryKey: ["allReview", id],
      });
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (!myReview?.data) return;
    setRating(myReview?.data?.rating || 0);
    setComment(myReview?.data?.comment || "");
  }, [myReview]);

  const fetchedComment = myReview?.data?.comment || "";

  return (
    <div className="space-y-10">
      <div className="bg-background rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Rate Your Experience
        </h2>

        <div className="flex flex-col items-start gap-4">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-10 h-10 cursor-pointer transition-all hover:scale-110
                                    ${
                                      (hoverRating || rating) >= star
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }
                                `}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              />
            ))}
          </div>

          {rating > 0 && (
            <p className="text-gray-600">
              You rated:{" "}
              <span className="font-semibold text-yellow-600">{rating}</span>{" "}
              star{rating !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        <div className="mt-6 space-y-4">
          <Textarea
            className="w-full md:w-2/3 border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience... (optional)"
            rows={4}
          />

          <Button
            disabled={comment === fetchedComment && rating === 0}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              comment === fetchedComment && rating === 0
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-yellow-400 text-gray-900 hover:bg-yellow-500"
            }`}
            onClick={() => reviewProvider({ id, rating, comment })}
          >
            Submit Review
          </Button>
        </div>
      </div>

      <div className="bg-background rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
          <span className="text-gray-500">{reviews.length} reviews</span>
        </div>

        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review: any) => (
              <div
                key={review.id}
                className="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="font-semibold text-gray-900">
                          {review.user?.name || "Anonymous"}
                        </p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {review.comment && (
                  <p className="text-gray-600  pl-13">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No reviews yet
            </h3>
            <p className="text-gray-500">
              Be the first to share your experience!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

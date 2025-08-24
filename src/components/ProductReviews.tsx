import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_id: string;
  user_email: string;
  helpful_votes: number;
  total_votes: number;
}

interface ProductReviewsProps {
  productId: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      // Note: In a real app, you'd need to create a reviews table and RLS policies
      // For demo purposes, we'll simulate reviews
      const simulatedReviews = [
        {
          id: '1',
          rating: 5,
          comment: 'Excellent product! Very satisfied with the quality.',
          created_at: new Date().toISOString(),
          user_id: 'user1',
          user_email: 'john@example.com',
          helpful_votes: 12,
          total_votes: 15,
        },
        {
          id: '2',
          rating: 4,
          comment: 'Good value for money. Fast delivery.',
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          user_id: 'user2', 
          user_email: 'jane@example.com',
          helpful_votes: 8,
          total_votes: 10,
        },
      ];
      
      setReviews(simulatedReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to leave a review",
      });
      return;
    }

    if (!newReview.comment.trim()) {
      toast({
        variant: "destructive",
        title: "Comment required",
        description: "Please write a comment for your review",
      });
      return;
    }

    setSubmitting(true);
    try {
      // In a real app, you'd insert into a reviews table
      const review = {
        id: Date.now().toString(),
        rating: newReview.rating,
        comment: newReview.comment,
        created_at: new Date().toISOString(),
        user_id: user.id,
        user_email: user.email || '',
        helpful_votes: 0,
        total_votes: 0,
      };

      setReviews([review, ...reviews]);
      setNewReview({ rating: 5, comment: '' });
      
      toast({
        title: "Review submitted",
        description: "Thank you for your review!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit review. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0]; // 1-5 stars
    reviews.forEach(review => {
      distribution[review.rating - 1]++;
    });
    return distribution;
  };

  const StarRating = ({ rating, size = 'sm', interactive = false, onChange }: {
    rating: number;
    size?: 'sm' | 'lg';
    interactive?: boolean;
    onChange?: (rating: number) => void;
  }) => {
    const starSize = size === 'lg' ? 'h-6 w-6' : 'h-4 w-4';
    
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= rating 
                ? 'fill-secondary text-secondary' 
                : 'text-muted-foreground'
            } ${interactive ? 'cursor-pointer hover:text-secondary' : ''}`}
            onClick={interactive && onChange ? () => onChange(star) : undefined}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading reviews...</div>
        </CardContent>
      </Card>
    );
  }

  const averageRating = getAverageRating();
  const distribution = getRatingDistribution();

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Average Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                {averageRating.toFixed(1)}
              </div>
              <StarRating rating={averageRating} size="lg" />
              <p className="text-muted-foreground mt-2">
                Based on {reviews.length} reviews
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-2">
                  <span className="text-sm w-8">{stars}★</span>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-secondary h-2 rounded-full"
                      style={{
                        width: `${reviews.length > 0 ? (distribution[stars - 1] / reviews.length) * 100 : 0}%`
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">
                    {distribution[stars - 1]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Write Review */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Rating</label>
              <StarRating 
                rating={newReview.rating} 
                size="lg"
                interactive
                onChange={(rating) => setNewReview(prev => ({ ...prev, rating }))}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Comment</label>
              <Textarea
                placeholder="Share your experience with this product..."
                value={newReview.comment}
                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                rows={4}
              />
            </div>
            
            <Button onClick={submitReview} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Avatar>
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.user_email}`} />
                  <AvatarFallback>
                    {review.user_email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {review.user_email.split('@')[0]}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <StarRating rating={review.rating} />
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {review.rating >= 4 && (
                      <Badge variant="secondary" className="bg-success/10 text-success">
                        Recommended
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-foreground">{review.comment}</p>
                  
                  <div className="flex items-center gap-4 pt-2">
                    <Button variant="ghost" size="sm">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Helpful ({review.helpful_votes})
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ThumbsDown className="h-4 w-4 mr-1" />
                      Not Helpful
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
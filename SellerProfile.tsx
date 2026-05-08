import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Flag, Loader2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const SellerProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [ratings, setRatings] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");

  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      const [profileRes, ratingsRes, listingsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", userId).single(),
        supabase.from("seller_ratings").select("*").eq("seller_id", userId).order("created_at", { ascending: false }),
        supabase.from("listings").select("*").eq("seller_id", userId).eq("status", "active"),
      ]);
      setProfile(profileRes.data);
      setRatings(ratingsRes.data || []);
      setListings(listingsRes.data || []);
      setLoading(false);
    };
    fetchData();
  }, [userId]);

  const avgRating = ratings.length > 0 ? ratings.reduce((s, r) => s + r.rating, 0) / ratings.length : 0;

  const handleSubmitRating = async () => {
    if (!user || !userId || newRating === 0) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("seller_ratings").insert({
        seller_id: userId,
        reviewer_id: user.id,
        rating: newRating,
        comment: newComment || null,
      });
      if (error) throw error;
      toast.success("Rating submitted! ⭐");
      setNewRating(0);
      setNewComment("");
      // Refresh ratings
      const { data } = await supabase.from("seller_ratings").select("*").eq("seller_id", userId).order("created_at", { ascending: false });
      setRatings(data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to submit rating");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReport = async () => {
    if (!user || !userId || !reportReason) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("fraud_reports").insert({
        reporter_id: user.id,
        reported_user_id: userId,
        reason: reportReason,
        details: reportDetails || null,
      });
      if (error) throw error;
      toast.success("Report submitted. We'll review it shortly.");
      setShowReport(false);
      setReportReason("");
      setReportDetails("");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit report");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-bold text-foreground mb-2">Seller not found</p>
          <Button onClick={() => navigate("/browse")}>Back to Browse</Button>
        </div>
      </div>
    );
  }

  const isOwnProfile = user?.id === userId;

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto flex items-center h-16 px-4 gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <span className="text-xl font-extrabold text-foreground">Seller Profile</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 text-3xl font-extrabold text-primary">
            {(profile.display_name || profile.username || "?")[0]?.toUpperCase()}
          </div>
          <h1 className="text-2xl font-extrabold text-foreground">{profile.display_name || profile.username || "Seller"}</h1>
          {profile.username && <p className="text-muted-foreground">@{profile.username}</p>}
          {profile.bio && <p className="text-sm text-muted-foreground mt-2">{profile.bio}</p>}

          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-gold fill-current" />
              <span className="font-bold text-foreground">{avgRating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">({ratings.length} reviews)</span>
            </div>
            <Badge variant="secondary">{listings.length} listings</Badge>
          </div>

          {!isOwnProfile && user && (
            <Button variant="ghost" size="sm" className="mt-3 text-destructive" onClick={() => setShowReport(!showReport)}>
              <Flag className="w-4 h-4 mr-1" />
              Report Seller
            </Button>
          )}
        </motion.div>

        {/* Report Form */}
        {showReport && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-destructive/5 border border-destructive/20 rounded-2xl p-5 mb-8">
            <h3 className="font-bold text-foreground mb-3">Report This Seller</h3>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full rounded-xl border border-border bg-card p-3 mb-3 text-sm"
            >
              <option value="">Select a reason...</option>
              <option value="Counterfeit items">Counterfeit items</option>
              <option value="Scam / never shipped">Scam / never shipped</option>
              <option value="Misleading listing">Misleading listing</option>
              <option value="Harassment">Harassment</option>
              <option value="Other">Other</option>
            </select>
            <Textarea placeholder="Additional details (optional)" value={reportDetails} onChange={(e) => setReportDetails(e.target.value)} className="rounded-xl mb-3" />
            <Button onClick={handleReport} disabled={!reportReason || submitting} className="rounded-full bg-destructive text-destructive-foreground">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Report"}
            </Button>
          </motion.div>
        )}

        {/* Listings */}
        {listings.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-extrabold text-foreground mb-4">Active Listings</h2>
            <div className="grid grid-cols-2 gap-3">
              {listings.map((l) => (
                <div key={l.id} onClick={() => navigate(`/product/${l.id}`)} className="bg-card border border-border rounded-2xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                  {l.images?.[0] && <img src={l.images[0]} alt={l.title} className="w-full aspect-square object-cover" />}
                  <div className="p-3">
                    <p className="font-bold text-foreground text-sm truncate">{l.title}</p>
                    <p className="text-primary font-extrabold">${Number(l.price).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Leave Rating */}
        {!isOwnProfile && user && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-extrabold text-foreground mb-4">Leave a Rating</h2>
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setNewRating(star)} className="transition-transform hover:scale-110">
                  <Star className={`w-8 h-8 ${star <= newRating ? "text-gold fill-current" : "text-muted-foreground/30"}`} />
                </button>
              ))}
            </div>
            <Textarea placeholder="Write a comment (optional)" value={newComment} onChange={(e) => setNewComment(e.target.value)} className="rounded-xl mb-4" />
            <Button onClick={handleSubmitRating} disabled={newRating === 0 || submitting} className="rounded-full bg-primary text-primary-foreground font-bold">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Rating"}
            </Button>
          </motion.div>
        )}

        {!user && !isOwnProfile && (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-3">Sign in to leave a rating or report</p>
            <Button onClick={() => navigate("/auth")} className="rounded-full bg-primary text-primary-foreground">Sign In</Button>
          </div>
        )}

        {/* Reviews List */}
        {ratings.length > 0 && (
          <div>
            <h2 className="text-lg font-extrabold text-foreground mb-4">Reviews</h2>
            <div className="space-y-3">
              {ratings.map((r) => (
                <div key={r.id} className="bg-secondary rounded-xl p-4">
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-4 h-4 ${s <= r.rating ? "text-gold fill-current" : "text-muted-foreground/20"}`} />
                    ))}
                  </div>
                  {r.comment && <p className="text-sm text-foreground">{r.comment}</p>}
                  <p className="text-xs text-muted-foreground mt-1">{new Date(r.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerProfile;

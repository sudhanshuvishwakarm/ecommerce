import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const submitRatingReview = createAsyncThunk(
    'ratingReview/submitRatingReview',
    async (data, { rejectWithValue }) => {
        try {
            const res = await axios.post('/api/ratingreview', {
                rating: data.rating,
                review: data.review,
                productId: data.productId,
                orderItemId: data.orderItemId
            });
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchProductReviews = createAsyncThunk(
    'ratingReview/fetchProductReviews',
    async (productId, { rejectWithValue }) => {
        try {
            const res = await axios.get(`/api/ratingreview?productId=${productId}`);
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const initialState = {
    loading: false,
    error: null,
    success: false,
    message: '',
    reviews: [],
    ratings: [],
    averageRating: 0
};

const ratingReviewSlice = createSlice({
    name: "ratingReview",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = false;
            state.message = '';
        },
        resetRatingReview: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
            // Submit Rating/Review
            .addCase(submitRatingReview.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(submitRatingReview.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message || 'Rating and review submitted successfully';
                state.error = null;
            })
            .addCase(submitRatingReview.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
                state.message = '';
            })
            // Fetch Product Reviews
            .addCase(fetchProductReviews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = action.payload.reviews || [];
                state.ratings = action.payload.ratings || [];
                state.averageRating = action.payload.averageRating || 0;
                state.error = null;
            })
            .addCase(fetchProductReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError, clearSuccess, resetRatingReview } = ratingReviewSlice.actions;
export default ratingReviewSlice.reducer;
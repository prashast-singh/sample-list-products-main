import { describe, it, expect } from 'vitest';
import { filterProducts } from './filter-products'; 
import type { Product } from './types' 

const mockProducts: Product[] = [
	{
		id: 1,
		title: "Product 1",
		description: "Description for Product 1",
		category: "Category 1",
		price: 99.99,
		discountPercentage: 10,
		rating: 4.5,
		stock: 20,
		tags: ["tag1", "tag2"],
		brand: "Brand 1",
		sku: "SKU12345",
		weight: 1.5,
		dimensions: { width: 10, height: 15, depth: 5 },
		warrantyInformation: "1-year warranty",
		shippingInformation: "Ships within 3 days",
		availabilityStatus: "In Stock",
		reviews: [
			{
				rating: 5,
				comment: "Great product!",
				date: "2023-09-01",
				reviewerName: "John Doe",
				reviewerEmail: "john@example.com",
			},
		],
		returnPolicy: "30 days return",
		minimumOrderQuantity: 1,
		meta: { createdAt: "2023-08-01", updatedAt: "2023-08-15", barcode: "123456789", qrCode: "qrcode123" },
		images: ["image1.jpg", "image2.jpg"],
		thumbnail: "thumbnail1.jpg",
	},
	{
		id: 2,
		title: "Product 2",
		description: "Description for Product 2",
		category: "Category 2",
		price: 120.00, // Above 100
		discountPercentage: 15,
		rating: 4.0,
		stock: 10,
		tags: ["tag3", "tag4"],
		brand: "Brand 2",
		sku: "SKU67890",
		weight: 2.0,
		dimensions: { width: 12, height: 16, depth: 6 },
		warrantyInformation: "6-month warranty",
		shippingInformation: "Ships within 5 days",
		availabilityStatus: "In Stock",
		reviews: [
			{
				rating: 4,
				comment: "Very good!",
				date: "2023-09-05",
				reviewerName: "Jane Smith",
				reviewerEmail: "jane@example.com",
			},
		],
		returnPolicy: "14 days return",
		minimumOrderQuantity: 1,
		meta: { createdAt: "2023-08-05", updatedAt: "2023-08-20", barcode: "987654321", qrCode: "qrcode456" },
		images: ["image3.jpg", "image4.jpg"],
		thumbnail: "thumbnail2.jpg",
	},
	{
		id: 3,
		title: "Product 3",
		description: "Description for Product 3",
		category: "Category 3",
		price: 50.00, // Below 100
		discountPercentage: 20,
		rating: 3.5,
		stock: 15,
		tags: ["tag5", "tag6"],
		brand: "Brand 3",
		sku: "SKU98765",
		weight: 3.0,
		dimensions: { width: 14, height: 17, depth: 8 },
		warrantyInformation: "2-year warranty",
		shippingInformation: "Ships within 2 days",
		availabilityStatus: "In Stock",
		reviews: [
			{
				rating: 3,
				comment: "It's okay",
				date: "2023-09-10",
				reviewerName: "Alice Johnson",
				reviewerEmail: "alice@example.com",
			},
		],
		returnPolicy: "60 days return",
		minimumOrderQuantity: 1,
		meta: { createdAt: "2023-08-10", updatedAt: "2023-08-25", barcode: "654321987", qrCode: "qrcode789" },
		images: ["image5.jpg", "image6.jpg"],
		thumbnail: "thumbnail3.jpg",
	},
];

describe('filter-products', () => {
	it('returns only products below or equal to 100', () => {
		const filtered = filterProducts(mockProducts,100);
		expect(filtered.length).toBe(2); // Only two products below 100
		expect(filtered).toEqual([
			mockProducts[0], // Product 1: price 99.99
			mockProducts[2], // Product 3: price 50.00
		]);
	});
});

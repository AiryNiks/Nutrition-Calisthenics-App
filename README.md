# Calisthenics & Localized Nutrition Tracker

A local-first web application designed to track strength-to-weight calisthenics progression and accurately log regional Indian diets and quick-commerce groceries.

## Overview
Standard fitness applications primarily track raw weight lifted and generic western ingredients. They often fail to track relative bodyweight strength (Strength-to-Weight ratio) and lack accurate macro profiles for regional staples (e.g., precise macro splits for a 1:1 Ragi-Bajra flour mix, loose local paneer, or regional dairy products). 

This application handles these specific use cases by combining a custom strength telemetry engine with a localized nutritional database, including parsing logic for quick-commerce platforms like Zepto and Blinkit.

## Core Features
* **Strength-to-Weight (S2W) Engine:** Telemetry tracking for calisthenics (pull-ups, dips, push-ups) that calculates relative strength against a shifting bodyweight baseline.
* **Localized Database:** Pre-seeded with regional staples and quick-commerce private labels.
* **Custom Recipe Calculator:** Dynamically builds macro profiles for multi-ingredient regional bases (such as Makhani gravies or hung curd marinades).
* **Minimalist UI:** Built with strict grid layouts, system theme syncing, and functional micro-interactions.
* **Local-First Architecture:** All user data, workout logs, and custom recipes are persisted to the browser's localStorage via Zustand.

## Tech Stack
* React 18 + TypeScript + Vite
* Zustand (State management with Persist Middleware)
* Tailwind CSS (Styling)
* Framer Motion (Structural animations)
* Lucide React (Icons)

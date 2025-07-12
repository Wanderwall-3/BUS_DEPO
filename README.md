# 🚌 College Bus Route Management System

A backend-powered web application that streamlines college transportation by dynamically assigning buses and drivers based on student routes. Built using **Spring Boot**, **JPA/Hibernate**, and **PostgreSQL**, it allows students to check evening bus assignments and enables admins to manage student and driver profiles.

---

## 🎓 Project Overview

At our college, students take designated buses in the morning. In the evening, however, bus assignments differ by route. This system provides:

- 🗂️ Real-time updates for **which bus and driver is assigned** to each return route
- 🔐 Secure student login to view and confirm evening bus details
- 👨‍💼 Admin panel for adding/editing drivers and student records

---

## 🔧 Tech Stack

- **Java 17**, **Spring Boot**
- **Hibernate & JPA** with advanced entity mapping (`@JoinColumn`, `@MapsId`)
- **PostgreSQL** for relational data and route mappings
- **Spring Security** with JWT authentication via HttpOnly cookies
- **Supabase** (optional) for file storage
- **Deployment**: Render (backend), Netlify (frontend)

---

## 💡 Key Features

- ✅ Secure login with JWT token & HttpOnly cookie
- ✅ Dynamic bus & driver allocation for evening routes
- ✅ Admin-controlled student & driver registration
- ✅ RESTful API with clear serialization and status codes
- ✅ MVC architecture for clean code separation

---

## 🧩 Architecture: MVC Pattern
src/ ├── config/ # App & security configuration ├── controller/ # REST endpoints for students, admin, driver updates ├── entity/ # Student, Driver, Route, Bus mappings ├── repository/ # Interfaces for DB access ├── service/ # Business logic └── security/ # JWT filters and token management


---

## 🚀 Demo

> See the app in action: login flow, route lookup, and admin panel.

[![Watch Demo](https://img.youtube.com/vi/pCQ0eZmoRsc/hqdefault.jpg)](https://youtu.be/pCQ0eZmoRsc)

📦 [Live Site](https://busdepo.netlify.app/)  
📁 [GitHub Repo](https://github.com/Wanderwall-3/BUS_DEPO)

---

## 🚀 Upcoming Features

- Student profile with preferred routes
- Bus capacity tracking
- Driver dashboard for route updates

---

## 🤝 Contribute or Collaborate

Open to backend collaborations and feature expansion. If you're a developer or designer, feel free to fork and suggest ideas!

---

## 📬 Contact

- **LinkedIn**: [linkedin.com/in/vigneshmurugan](https://www.linkedin.com/in/vigneshmurugan-/)
- **Email**: wanderwall420@gmail.com

---


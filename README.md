# 👕 T-Shirt Design SaaS App

A sleek **3D T-shirt design platform** built with **Next.js, React, Three.js, and TailwindCSS**, where users can:

* Customize a 3D T-shirt model in real time.
* Add and style text (font family, size, color).
* Upload custom images/logos.
* Apply textures and background colors.
* Export or present their final design.

---

## 🚀 Features

✅ **3D T-Shirt Model** – Interactive T-shirt rendered with `react-three-fiber` & `drei`.
✅ **Design Bar Tools** – Add text with Google Fonts, choose font size & color.
✅ **Sidebar** – Upload images & choose textures.
✅ **Real-Time Preview** – See edits applied instantly on the 3D model.
✅ **Responsive UI** – Clean, elegant SaaS-style interface built with TailwindCSS.
✅ **Export & Share** – Options to share, present, or export your design.

---

## 🛠️ Tech Stack

* **Frontend:** [Next.js](https://nextjs.org/), [React](https://reactjs.org/)
* **3D Rendering:** [React Three Fiber](https://docs.pmnd.rs/react-three-fiber), [drei](https://github.com/pmndrs/drei)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Icons:** [React Icons](https://react-icons.github.io/react-icons/)
* **Fonts:** [Google Fonts API](https://developers.google.com/fonts)

---

## 📂 Project Structure

```
src/
 ├── components/
 │   ├── layout/
 │   │   ├── DesignBar.tsx   # Top toolbar with text, fonts, colors, actions
 │   │   ├── Sidebar.tsx     # Sidebar with textures & image upload
 │   ├── Canvas.tsx          # 3D T-shirt canvas
 │   ├── layoutelement/
 │   │   ├── ColorPicker.tsx # Custom color picker
 │   │   ├── FontPicker.tsx  # Google Fonts picker
 ├── app/
 │   ├── page.tsx            # Main app entry
```

---

## ⚡ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/tshirt-saas.git
cd tshirt-saas
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Setup Environment Variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_GOOGLE_FONT_API_KEY=your_google_fonts_api_key
```

👉 Get your API key from [Google Fonts Developer API](https://developers.google.com/fonts/docs/developer_api).

### 4. Run Development Server

```bash
npm run dev
```

App will be live at [http://localhost:3000](http://localhost:3000).

---

## 🎨 Usage

1. **Add Text** – Enter text, choose font family, size, and color.
2. **Textures** – Select from predefined swatches.
3. **Upload Image** – Insert custom logos or images.
4. **Interact with Model** – Rotate and preview T-shirt in real time.
5. **Export** – Share, present, or export your final design.

---

## 📸 Preview

| **DesignBar**                                 | **Sidebar**                              | **Canvas**                             |
| --------------------------------------------- | ---------------------------------------- | -------------------------------------- |
| ![Design Bar](docs/screenshots/designbar.png) | ![Sidebar](docs/screenshots/sidebar.png) | ![Canvas](docs/screenshots/canvas.png) |

---

## 📌 Roadmap

* [ ] Add drag-and-drop positioning of text & images.
* [ ] Add different T-shirt types (hoodie, polo, full sleeve).
* [ ] Save projects to cloud with authentication.
* [ ] Payment integration for ordering designs.

---

## 🤝 Contributing

Pull requests are welcome. Please open an issue first to discuss major changes.

---

⚡ Designed & Developed with ❤️ by Rajeev Ranjan (https://github.com/rajeev12r)

---
# Dokumentasi Proyek E-Commerce Thrifting Store

## 1. Use Case Diagram

```mermaid
flowchart LR
    Cust(["👤 Customer / Visitor"])
    Adm(["👔 Store Administrator"])
    DB(["🗄️ Supabase (DB & Auth)"])
    API_Ship(["🚚 Komerce / RajaOngkir"])
    API_Pay(["💳 Midtrans (Payment)"])

    subgraph System["Rainsecond E-Commerce System"]
        direction TB
        UC1("Browse & Search Products")
        UC2("View Product Details")
        UC3("Manage Cart")
        UC4("Checkout Order")
        UC5("Single Unified Login (Email/Google)")
        UC6("Pay Order")
        UC7("View Dashboard (Stats & Charts)")
        UC8("Manage Inventory (Products)")
        UC9("Manage Orders")
        UC10("Manage UI Banners")
        UC11("Calculate Shipping Cost")
        UC12("Process Transaction")
    end

    Cust --> UC1
    Cust --> UC2
    Cust --> UC3
    Cust --> UC4
    Cust --> UC5
    Cust --> UC6
    Adm --> UC5
    Adm --> UC7
    Adm --> UC8
    Adm --> UC9
    Adm --> UC10
    UC4 -. "<<include>>" .-> UC11
    UC4 -. "<<include>>" .-> UC5
    UC6 -. "<<include>>" .-> UC12
    UC5 --> DB
    UC8 --> DB
    UC9 --> DB
    UC11 --> API_Ship
    UC12 --> API_Pay
```

---

## 2. Class Diagram

```mermaid
classDiagram
    class User {
        +UUID id
        +String email
        +String role
        +DateTime created_at
    }
    class Product {
        +UUID id
        +String name
        +Decimal price
        +String status
        +Array image_urls
    }
    class Order {
        +String order_id
        +UUID user_id
        +Decimal total_amount
        +String status
    }
    class ShippingDetail {
        <<DataType>>
        +String courier_name
        +Decimal cost
    }
    class PaymentDetail {
        <<DataType>>
        +String payment_type
    }
    User "1" -- "0..*" Order : places
    Order "1" *-- "1" ShippingDetail : contains
    Order "1" *-- "1" PaymentDetail : contains
    Order "0..*" -- "1..*" Product : includes
```

---

## 3. Activity Diagram (Alur Checkout)

```mermaid
flowchart TD
    Start(("Mulai")) --> Buka_Keranjang
    
    subgraph Frontend ["Area Pengguna / Frontend"]
        Buka_Keranjang["Buka Halaman Cart"]
        Cek_Login{"Apakah Sudah Login?"}
        Isi_Alamat["Isi Alamat & Kota Tujuan"]
        Pilih_Kurir["Pilih Jasa Kurir"]
        Klik_Bayar["Klik Bayar Sekarang"]
    end
    
    subgraph Backend ["Area Sistem Server / Backend"]
        Tarik_Data_Komerce["Request Biaya ke API Komerce"]
        Buat_Order_DB["Simpan Order Draft ke Supabase"]
        Buat_Token_Midtrans["Request Snap Token API Midtrans"]
    end

    Buka_Keranjang --> Cek_Login
    Cek_Login -- "Sudah" --> Isi_Alamat
    Isi_Alamat --> Tarik_Data_Komerce
    Tarik_Data_Komerce --> Pilih_Kurir
    Pilih_Kurir --> Klik_Bayar
    Klik_Bayar --> Buat_Order_DB
    Buat_Order_DB --> Buat_Token_Midtrans
    Buat_Token_Midtrans --> Finish(("Selesai"))
```

---

## 4. Tabel Pengujian Blackbox

| Skenario | Hasil yang Diharapkan |
|---|---|
| Login Admin yang benar | Masuk ke halaman Dashboard Admin `/admin` |
| Buka Checkout tanpa Login | Dialihkan (Redirect) ke halaman Login |
| Pilih kota tujuan di Cart | API Komerce merespon dengan daftar harga kurir |
| Pembayaran Gagal di Midtrans | Status Order menjadi "cancel", Barang kembali "available" |

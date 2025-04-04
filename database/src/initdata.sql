INSERT INTO "product" ("product_id", "product_name", "selling_price","purchase_price","img","date") VALUES
('PD-00001', 'ขนมเกียบกุ้ง', 50,30,'images/product.webp','2024-07-19'),
('PD-00002', 'ขนมทานตะวัน', 20,15,'images/product.webp','2024-07-19'),
('PD-00003', 'น้ำอัดลม', 10,8,'images/product.webp','2024-07-19'),
('PD-00004', 'น้ำแดง', 12,10,'images/product.webp','2024-07-19'),
('PD-00005', 'โซดา', 15,10,'images/product.webp','2024-07-19');

INSERT INTO "cart" ("cart_id", "unit_count", "product_id","user_id","date") VALUES
('CT-20240726-pangsagis-1',2,'PD-00001','pangsagis','2024-07-19'),
('CT-20240726-pangsagis-2',3,'PD-00003','pangsagis','2024-07-19');

INSERT INTO "category" ("category_id","category_name","user_id") VALUES
('001','ขนม','pangsagis'),
('002','นม','pangsagis'),
('003','เครื่องดื่ม','pangsagis'),
('004','เครื่องดื่มแอลกอฮอล์','pangsagis'),
('005','เครื่องปรุงรส','pangsagis'),
('006','ของใช้ในบ้าน','pangsagis'),
('007','ยา','pangsagis');

INSERT INTO "user" ("user_id", "password", "first_name","last_name","email","phone","date") VALUES
('pangsagis','pang1201129','witchapart','last_name','pangsagis@gmail.com','0837531375','2024-07-19');
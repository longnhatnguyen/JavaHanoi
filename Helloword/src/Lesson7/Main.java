package Lesson7;

public class Main {
    public static void main(String[] args) {
        //1 chuẩn bị nguyên liệu, 2. trộn bột. 3. nướng bánh, 4. trang trí
        AbstractBanh banhmi = new BanhMi();
        AbstractBanh banhquy = new BanhQuy();
        banhmi.lambanh();
        banhquy.lambanh();
    }
}

package Lesson7;

public class BanhMi extends AbstractBanh{
    @Override
    protected void chuanBiNguyenLieu() {
        System.out.println("Banh mi chuan bi bot");

    }

    @Override
    protected void tronBot() {
        System.out.println("Banh mi tron bot");
    }

    @Override
    protected void nuongBanh() {
        System.out.println("Banh mi nuong banh");
    }

    @Override
    protected void trangTri() {
        System.out.println("Banh mi trang tri");
    }
}

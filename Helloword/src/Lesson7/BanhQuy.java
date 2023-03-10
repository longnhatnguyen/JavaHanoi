package Lesson7;

public class BanhQuy extends AbstractBanh{
    @Override
    protected void chuanBiNguyenLieu() {
        System.out.println("Banh quy chuan bi bot");

    }

    @Override
    protected void tronBot() {
        System.out.println("Banh quy tron bot");
    }

    @Override
    protected void nuongBanh() {
        System.out.println("Banh quy nuong banh");
    }

    @Override
    protected void trangTri() {
        System.out.println("Banh quy trang tri");
    }
}

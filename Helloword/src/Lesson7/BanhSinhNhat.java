package Lesson7;

public class BanhSinhNhat extends AbstractBanh{

    @Override
    protected void chuanBiNguyenLieu() {
        System.out.println("Banh sinh nhat chuan bi bot");

    }

    @Override
    protected void tronBot() {
        System.out.println("Banh sinh nhat tron bot");
    }

    @Override
    protected void nuongBanh() {
        System.out.println("Banh sinh nhat nuong banh");
    }

    @Override
    protected void trangTri() {
        System.out.println("Banh sinh nhat trang tri");
    }
}

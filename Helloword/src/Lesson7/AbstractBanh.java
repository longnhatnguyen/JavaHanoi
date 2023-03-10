package Lesson7;

public abstract class AbstractBanh {
    public void lambanh(){
        chuanBiNguyenLieu();
        tronBot();
        nuongBanh();
        trangTri();
    }

    protected abstract void chuanBiNguyenLieu(); // Khong co thanh phan trieu khai
    //bat buoc thang con ke thua phai co phan trien khai
    protected abstract void tronBot();
    protected abstract void nuongBanh();
    protected abstract void trangTri();

}

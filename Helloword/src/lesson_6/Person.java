package lesson_6;

import java.util.Scanner;

public class Person {
    private String id;
    private String fullName;
    private String birthDay;

    public void input (Scanner scanner){
        System.out.println("Nhap ho va ten");
        this.fullName = scanner.nextLine();
        System.out.println("Nhap chung minh thu");
        this.id = scanner.nextLine();
        System.out.println("Nhap ngay thang nam sinh");
        this.birthDay = scanner.nextLine();
    }
    public String info(){
        StringBuilder builder = new StringBuilder();
        builder.append("Ho va ten: ").append(this.fullName).append(" CMND ").append(this.id).append("Ngay thang nam sinh").append(this.birthDay);
        return builder.toString();
    }
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getBirthDay() {
        return birthDay;
    }

    public void setBirthDay(String birthDay) {
        this.birthDay = birthDay;
    }
}

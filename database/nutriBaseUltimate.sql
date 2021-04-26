drop database if exists nutriBase;
create database if not exists nutriBase;
use nutriBase;

create table tipoUsuario(
	idTiU int not null primary key auto_increment,
    desTiU nvarchar(12) not null
);

insert into tipoUsuario(desTiU) values('Nutriologo');
insert into tipoUsuario(desTiU) values('Paciente');

create table Usuario(
	idUsuario int not null primary key auto_increment,
    idTiU int not null,
    nombre nvarchar(45) not null,
    apellidoP nvarchar(45),
    apellidoM nvarchar(45),
    tel varchar(20),
    userName nvarchar(45) not null,
    passw nvarchar(100) not null,
    email nvarchar(30),
    fechaCumple date,
    sexo nvarchar(45) not null,
    foreign key(idTiU) references tipoUsuario(idTiU)
);

create table DatPaciente(
	idDatP int not null primary key auto_increment,
    peso int not null,
    altura int not null,
    imc int,
    tmb int,
    enfC nvarchar(100)
);

create table Paciente(
	idPaciente int not null primary key auto_increment,
    idUsuario int not null,
    idDatP int not null,
    foreign key(idUsuario) references Usuario(idUsuario),
    foreign key(idDatP) references DatPaciente(idDatP)
);

create table Nutriologo(
	idNutri int not null primary key auto_increment,
    idUsuario int not null,
    cedula nvarchar(45),
    foreign key(idUsuario) references Usuario(idUsuario)
);


create table Cita(
	idCita int not null primary key auto_increment,
    idNutri int not null,
    idPaciente int not null,
    fechaHora datetime
);

create table tipoAli(
	idTipoA int not null primary key auto_increment,
    descTiA nvarchar(45) not null
);

insert into tipoAli(descTiA) values('Frutas y verduras');
insert into tipoAli(descTiA) values('Cereales, panes, pasta y otros derivados');
insert into tipoAli(descTiA) values('Legumbres (o leguminosas)');
insert into tipoAli(descTiA) values('Tubérculos');
insert into tipoAli(descTiA) values('Frutos secos');
insert into tipoAli(descTiA) values('Carne, pescado y huevos');
insert into tipoAli(descTiA) values('Leche y productos lácteos');
insert into tipoAli(descTiA) values('Aceites, grasas y mantequillas');
insert into tipoAli(descTiA) values('Alimentos ricos en grasa, azúcar y sal');
insert into tipoAli(descTiA) values('Bebidas');

create table Cantidades(
	idCant int not null primary key auto_increment,
    calorias float,
    proteinas float,
    hidratos float,
    grasas float,
    indiceG float,
    salesMine float,
    vitamins float
);


create table Alimentos(
	idAlimentos int not null primary key auto_increment,
    nombreA nvarchar(45),
    idTipoA int not null,
    idCant int not null,
    descri nvarchar(200),
    foreign key(idTipoA) references tipoAli(idTipoA),
    foreign key(idCant) references Cantidades(idCant)
);
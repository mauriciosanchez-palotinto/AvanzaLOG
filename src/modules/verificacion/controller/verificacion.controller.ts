import { Controller, Get, Post, Body, Param, UseGuards, ParseIntPipe, Request } from "@nestjs/common";
import { VerificacionService } from "../service/verificacion.service";
import { CreateVerificacionDto } from "../dto/create-verificacion.dto";
import { JwtGuard } from "@/common/guards/jwt.guard";


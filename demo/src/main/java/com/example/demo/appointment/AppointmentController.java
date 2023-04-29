package com.example.demo.appointment;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping(value = "/api/v1/appointment")
public class AppointmentController {
    private final AppointmentService appointmentService;

    @ModelAttribute
    public void setResponseHeader(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
    }
    record createNewAppReqbod(
         Timestamp bookingTime,
         int patientId,
         String doctorId,
         Timestamp startTime,
         Timestamp endTime,
         boolean isFollowup,
         boolean markForFollowup,
         String followupReason,
         String status,
         String description
    ){}
    record setMarkForFollowupReqbod(Integer appId, Boolean value){}
    record setStatusReqbod(Integer appId, String value){}
    record setTimeReqbod(Integer appId, Timestamp value){}

    record getEarlReqbod(Integer docId){}
    record getAppById(Integer appId){}

    record getPatAppReqBod(Integer patId){}
    record getDocAppReqBod(Integer docId){}

    record getAppFollowById(Integer appId, Boolean mark, String followupReason){}

    public AppointmentController(AppointmentService appointmentService)
    {
        this.appointmentService = appointmentService;
    }

    @CrossOrigin
    @PostMapping("/create_appointment")
    public Appointment createAppointment(@RequestBody createNewAppReqbod reqbod) {
        Appointment newAppointment = appointmentService.createAppointment(reqbod.bookingTime, reqbod.patientId, reqbod.doctorId, reqbod.startTime, reqbod.endTime, reqbod.isFollowup, reqbod.markForFollowup, reqbod.followupReason, reqbod.status, reqbod.description);
        return newAppointment;
    }
    @CrossOrigin
    @PostMapping("/set_mark_for_followup")
    public boolean setMarkForFollowup(@RequestBody setMarkForFollowupReqbod req_bod) {
        boolean success = appointmentService.setMarkForFollowup(req_bod.appId, req_bod.value);
        return success;
    }

    @CrossOrigin
    @PostMapping("/set_status")
    public boolean setStatus(@RequestBody setStatusReqbod req_bod) {
        boolean success = appointmentService.setStatus(req_bod.appId, req_bod.value);
        return success;
    }

    @CrossOrigin
    @PostMapping("/get_status")
    public String getStatus(@RequestBody getAppById req_bod) {
        String status = appointmentService.getStatus(req_bod.appId);
        return status;
    }

    class QueueStatus {
        public String status;
        public Integer count;
        public Boolean doctor_live;
    }
    @CrossOrigin
    @PostMapping("/get_queue_status")
    public QueueStatus getQueueStatus(@RequestBody getAppById req_bod) {
        QueueStatus qs = new QueueStatus();
        qs.status = appointmentService.getStatus(req_bod.appId);
        qs.count = appointmentService.get_queue_count(req_bod.appId);
        qs.doctor_live = appointmentService.get_doctor_status(req_bod.appId);
        return qs;
    }

    @CrossOrigin
    @PostMapping("/set_start_time")
    public boolean setStartTime(@RequestBody setTimeReqbod req_bod) {
        boolean success = appointmentService.setStartTime(req_bod.appId, req_bod.value);
        return success;
    }

    @CrossOrigin
    @PostMapping("/set_end_time")
    public boolean setEndTime(@RequestBody setTimeReqbod req_bod) {
        boolean success = appointmentService.setEndTime(req_bod.appId, req_bod.value);
        return success;
    }

    @CrossOrigin
    @PostMapping("/get_earliest_waiting_app")
    public Appointment get_earliest_waiting_appointment(@RequestBody getEarlReqbod req_bod) {
        return appointmentService.get_earliest_appointment(req_bod.docId);
    }

    @CrossOrigin
    @PostMapping("/get_appointment_by_id")
    public Appointment get_appointment_by_id(@RequestBody getAppById req_bod) {
        return appointmentService.get_appointment_by_id(req_bod.appId);
    }
    class AppointmentHistoryObj{
        public Appointment appointment;
        public String name;
        public String specialization;

        public String getName() {
            return name;
        }
        public void setName(String name) {
            this.name = name;
        }

        public String getSpecialization() {
            return specialization;
        }

        public void setSpecialization(String specialization) {
            this.specialization = specialization;
        }

        public Appointment getAppointment() {
            return appointment;
        }

        public void setAppointment(Appointment appointment) {
            this.appointment = appointment;
        }
    }

    @CrossOrigin
    @PostMapping("/get_patient_appointments")
    public List<AppointmentHistoryObj> get_patient_appointments(@RequestBody getPatAppReqBod req_bod) {
        List<AppointmentHistoryObj> list = new ArrayList<AppointmentHistoryObj>();
        List<Appointment> aps_list = appointmentService.get_patient_appointments(req_bod.patId);
        List<String> name_list = appointmentService.get_doctor_names(req_bod.patId);
        List<String> specs_list = appointmentService.get_doctor_specs(req_bod.patId);
        for (int i = 0; i < aps_list.size(); i++) {
            AppointmentHistoryObj temp = new AppointmentHistoryObj();
            temp.appointment = aps_list.get(i);
            temp.name = name_list.get(i);
            temp.specialization = specs_list.get(i);
            list.add(temp);
        }
        return list;
    }

    @CrossOrigin
    @PostMapping("/get_doctor_appointments")
    public List<AppointmentHistoryObj> get_doctor_appointments(@RequestBody getDocAppReqBod req_bod) {
        List<AppointmentHistoryObj> list = new ArrayList<AppointmentHistoryObj>();
        List<Appointment> aps_list = appointmentService.get_doctor_appointments(req_bod.docId);
        List<String> name_list = appointmentService.get_patient_names(req_bod.docId);
        for (int i = 0; i < aps_list.size(); i++) {
            AppointmentHistoryObj temp = new AppointmentHistoryObj();
            temp.appointment = aps_list.get(i);
            temp.name = name_list.get(i);
            temp.specialization = "";
            list.add(temp);
        }
        return list;
    }

    @CrossOrigin
    @PostMapping("/get_doctor_followup_appointments")
    public List<AppointmentHistoryObj> get_doctor_followup_appointments(@RequestBody getDocAppReqBod req_bod) {
        List<AppointmentHistoryObj> list = new ArrayList<AppointmentHistoryObj>();
        List<Appointment> aps_list = appointmentService.get_doctor_followup_appointments(req_bod.docId);
        List<String> name_list = appointmentService.get_patient_names(req_bod.docId);
        for (int i = 0; i < aps_list.size(); i++) {
            AppointmentHistoryObj temp = new AppointmentHistoryObj();
            temp.appointment = aps_list.get(i);
            temp.name = name_list.get(i);
            temp.specialization = "";

            list.add(temp);
        }
        return list;
    }

    @CrossOrigin
    @PostMapping("/set_appointment_for_followup")
    public Boolean set_appointment_for_followup(@RequestBody getAppFollowById req_bod) {
        return appointmentService.set_appointment_for_followup(req_bod.appId,req_bod.mark, req_bod.followupReason);
    }


//    @CrossOrigin
//    @PostMapping("/send_sse_pat")
//    public Appointment get_appointment_by_id(@RequestBody getAppById req_bod) {
//        return appointmentService.get_appointment_by_id(req_bod.appId);
//    }

}

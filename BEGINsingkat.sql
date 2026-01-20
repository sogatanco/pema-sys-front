BEGIN
    DECLARE v_id_base INT;
    DECLARE v_fin_emp VARCHAR(30);
    DECLARE v_fin_pos VARCHAR(100);

    DECLARE v_dir VARCHAR(30);
    DECLARE v_mgr VARCHAR(30);
    DECLARE v_spv VARCHAR(30);
    DECLARE v_mgr_eks VARCHAR(30);

    /* ================= DATA UTAMA ================= */
    SELECT id_base
    INTO v_id_base
    FROM ptpemaco_apam.struktur_lengkap_oke
    WHERE employe_id = NEW.employe_id
    LIMIT 1;

    SELECT s.employe_id, p.position_name
    INTO v_fin_emp, v_fin_pos
    FROM ptpemaco_apam.struktur_lengkap_oke s
    JOIN ptpemaco_apam.positions p ON p.position_id = 13
    WHERE s.position_id = 13
    LIMIT 1;

    SELECT dir_terkait, manager_terkait, supervisor_terkait, manager_eksekutif
    INTO v_dir, v_mgr, v_spv, v_mgr_eks
    FROM ptpemaco_apam.atasan_terkait
    WHERE employe_id = NEW.employe_id
    LIMIT 1;

    /* ================= VALIDASI ================= */
    IF NEW.employe_id IS NOT NULL AND NEW.employe_id <> '-' THEN

        INSERT INTO ptpemaco_apam.notifications
        VALUES (NEW.submitted_by, NEW.employe_id, 30, '#2');

        /* =====================================================
           BASE 1 & 2
        ====================================================== */
        IF v_id_base IN (1,2) THEN

            INSERT INTO ptpemaco_apam.notifications
            VALUES (NEW.submitted_by, v_fin_emp, 32, '#3');

            INSERT INTO ptpemaco_esign.verif_steps
            VALUES (v_fin_emp, v_fin_pos, NEW.nomor_dokumen,1,'verifikasi_biaya',NULL,NULL);

            INSERT INTO ptpemaco_esign.verif_steps
            SELECT employe_id, position_name, NEW.nomor_dokumen, step,'paraf',NULL,NULL
            FROM (
                SELECT employe_id, position_name, 2 step FROM ptpemaco_apam.struktur_lengkap_oke WHERE id_base=4 ORDER BY employe_id LIMIT 1 OFFSET 0
                UNION ALL
                SELECT employe_id, position_name, 3 FROM ptpemaco_apam.struktur_lengkap_oke WHERE id_base=4 ORDER BY employe_id LIMIT 1 OFFSET 1
                UNION ALL
                SELECT employe_id, position_name, 4 FROM ptpemaco_apam.struktur_lengkap_oke WHERE id_base=4 ORDER BY employe_id LIMIT 1 OFFSET 2
            ) x;

            INSERT INTO ptpemaco_esign.verif_steps
            SELECT employe_id, position_name, NEW.nomor_dokumen,5,'sign',NULL,NULL
            FROM ptpemaco_apam.struktur_lengkap_oke WHERE id_base=3 LIMIT 1;

        /* =====================================================
           BASE 3
        ====================================================== */
        ELSEIF v_id_base = 3 THEN

            INSERT INTO ptpemaco_apam.notifications
            VALUES (NEW.submitted_by, v_fin_emp, 32, '#3');

            INSERT INTO ptpemaco_esign.verif_steps
            VALUES (v_fin_emp, v_fin_pos, NEW.nomor_dokumen,1,'verifikasi_biaya',NULL,NULL);

            INSERT INTO ptpemaco_esign.verif_steps
            SELECT employe_id, position_name, NEW.nomor_dokumen,2,'paraf',NULL,NULL
            FROM ptpemaco_apam.struktur_lengkap_oke WHERE position_id=109 LIMIT 1;

            INSERT INTO ptpemaco_esign.verif_steps
            SELECT employe_id, position_name, NEW.nomor_dokumen,3,'sign',NULL,NULL
            FROM ptpemaco_apam.struktur_lengkap_oke WHERE position_id=1 LIMIT 1;

        /* =====================================================
           BASE 4
        ====================================================== */
        ELSEIF v_id_base = 4 THEN

            INSERT INTO ptpemaco_apam.notifications
            VALUES (NEW.submitted_by, v_fin_emp, 32, '#3');

            INSERT INTO ptpemaco_esign.verif_steps
            VALUES (v_fin_emp, v_fin_pos, NEW.nomor_dokumen,1,'verifikasi_biaya',NULL,NULL);

            IF NEW.employe_id <>
               (SELECT employe_id FROM ptpemaco_apam.struktur_lengkap_oke WHERE position_id=6 LIMIT 1) THEN

                INSERT INTO ptpemaco_esign.verif_steps
                SELECT employe_id, position_name, NEW.nomor_dokumen,2,'paraf',NULL,NULL
                FROM ptpemaco_apam.struktur_lengkap_oke WHERE position_id=6 LIMIT 1;

                INSERT INTO ptpemaco_esign.verif_steps
                SELECT employe_id, position_name, NEW.nomor_dokumen,3,'sign',NULL,NULL
                FROM ptpemaco_apam.struktur_lengkap_oke WHERE position_id=3 LIMIT 1;
            ELSE
                INSERT INTO ptpemaco_esign.verif_steps
                SELECT employe_id, position_name, NEW.nomor_dokumen,2,'sign',NULL,NULL
                FROM ptpemaco_apam.struktur_lengkap_oke WHERE position_id=3 LIMIT 1;
            END IF;

        /* =====================================================
           BASE 5
        ====================================================== */
        ELSEIF v_id_base = 5 THEN

            INSERT INTO ptpemaco_apam.notifications
            VALUES (NEW.submitted_by, v_fin_emp, 32, '#3');

            INSERT INTO ptpemaco_esign.verif_steps
            VALUES (v_fin_emp, v_fin_pos, NEW.nomor_dokumen,1,'verifikasi_biaya',NULL,NULL);

            INSERT INTO ptpemaco_esign.verif_steps
            SELECT employe_id, position_name, NEW.nomor_dokumen,2,'paraf',NULL,NULL
            FROM ptpemaco_apam.struktur_lengkap_oke WHERE position_id=109 LIMIT 1;

            INSERT INTO ptpemaco_esign.verif_steps
            SELECT employe_id, position_name, NEW.nomor_dokumen,3,'sign',NULL,NULL
            FROM ptpemaco_apam.struktur_lengkap_oke WHERE position_id=1 LIMIT 1;

        /* =====================================================
           BASE 6 & 7
        ====================================================== */
        ELSEIF v_id_base IN (6,7) THEN

            INSERT INTO ptpemaco_apam.notifications
            VALUES (NEW.submitted_by, v_fin_emp, 32, '#3');

            INSERT INTO ptpemaco_esign.verif_steps
            VALUES (v_fin_emp, v_fin_pos, NEW.nomor_dokumen,1,'verifikasi_biaya',NULL,NULL);

            INSERT INTO ptpemaco_esign.verif_steps
            SELECT employe_id, position_name, NEW.nomor_dokumen,2,'paraf',NULL,NULL
            FROM ptpemaco_apam.struktur_lengkap_oke
            WHERE employe_id = COALESCE(v_dir,
                  (SELECT employe_id FROM ptpemaco_apam.struktur_lengkap_oke WHERE position_id=6 LIMIT 1))
            LIMIT 1;

            INSERT INTO ptpemaco_esign.verif_steps
            SELECT employe_id, position_name, NEW.nomor_dokumen,3,'sign',NULL,NULL
            FROM ptpemaco_apam.struktur_lengkap_oke WHERE position_id=3 LIMIT 1;

        /* =====================================================
           BASE 8 & 9
        ====================================================== */
        ELSEIF v_id_base IN (8,9) THEN

            INSERT INTO ptpemaco_esign.verif_steps
            SELECT COALESCE(v_mgr,v_spv,v_mgr_eks),
                   position_name, NEW.nomor_dokumen,1,'paraf',NULL,NULL
            FROM ptpemaco_apam.struktur_lengkap_oke
            WHERE employe_id = COALESCE(v_mgr,v_spv,v_mgr_eks)
            LIMIT 1;

            INSERT INTO ptpemaco_esign.verif_steps
            VALUES (v_fin_emp, v_fin_pos, NEW.nomor_dokumen,2,'verifikasi_biaya',NULL,NULL);

            INSERT INTO ptpemaco_esign.verif_steps
            SELECT employe_id, position_name, NEW.nomor_dokumen,3,'sign',NULL,NULL
            FROM ptpemaco_apam.struktur_lengkap_oke
            WHERE employe_id = COALESCE(v_dir,
                  (SELECT employe_id FROM ptpemaco_apam.struktur_lengkap_oke WHERE position_id=3 LIMIT 1))
            LIMIT 1;

        /* =====================================================
           BASE 10
        ====================================================== */
        ELSEIF v_id_base = 10 THEN

            INSERT INTO ptpemaco_apam.notifications
            VALUES (NEW.submitted_by, v_fin_emp, 32, '#3');

            INSERT INTO ptpemaco_esign.verif_steps
            VALUES (v_fin_emp, v_fin_pos, NEW.nomor_dokumen,1,'verifikasi_biaya',NULL,NULL);

            INSERT INTO ptpemaco_esign.verif_steps
            SELECT COALESCE(v_mgr,v_spv,v_mgr_eks),
                   position_name, NEW.nomor_dokumen,2,'sign',NULL,NULL
            FROM ptpemaco_apam.struktur_lengkap_oke
            WHERE employe_id = COALESCE(v_mgr,v_spv,v_mgr_eks)
            LIMIT 1;

        END IF;

    ELSE
    /* notif + verifikasi finance */
    INSERT INTO ptpemaco_apam.notifications
    VALUES (
        NEW.submitted_by,
        (SELECT employe_id FROM ptpemaco_apam.struktur_lengkap_oke WHERE position_id=13 LIMIT 1),
        32, '#3'
    );

    INSERT INTO ptpemaco_esign.verif_steps
    VALUES (
        (SELECT employe_id FROM ptpemaco_apam.struktur_lengkap_oke WHERE position_id=13 LIMIT 1),
        (SELECT position_name FROM ptpemaco_apam.positions WHERE position_id=13 LIMIT 1),
        NEW.nomor_dokumen, 1, 'verifikasi_biaya', NULL, NULL
    );

    /* paraf dari atasan pembuat */
    INSERT INTO ptpemaco_esign.verif_steps
    VALUES (
        COALESCE(
            (SELECT dir_terkait FROM ptpemaco_apam.atasan_terkait WHERE employe_id=NEW.submitted_by LIMIT 1),
            (SELECT employe_id FROM ptpemaco_apam.struktur_lengkap_oke WHERE position_id=6 LIMIT 1)
        ),
        (SELECT position_name FROM ptpemaco_apam.struktur_lengkap_oke
         WHERE employe_id = COALESCE(
            (SELECT dir_terkait FROM ptpemaco_apam.atasan_terkait WHERE employe_id=NEW.submitted_by LIMIT 1),
            (SELECT employe_id FROM ptpemaco_apam.struktur_lengkap_oke WHERE position_id=6 LIMIT 1)
         ) LIMIT 1),
        NEW.nomor_dokumen, 2, 'paraf', NULL, NULL
    );

    /* sign direktur */
    INSERT INTO ptpemaco_esign.verif_steps
    VALUES (
        (SELECT employe_id FROM ptpemaco_apam.struktur_lengkap_oke WHERE position_id=3 LIMIT 1),
        (SELECT position_name FROM ptpemaco_apam.struktur_lengkap_oke WHERE position_id=3 LIMIT 1),
        NEW.nomor_dokumen, 3, 'sign', NULL, NULL
    );


    END IF;
END

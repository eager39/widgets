<?php
include ("baza.php");
class DB
    {
    private $conn;
    function __construct()
        {
        $this->conn = new mysqli(HOST, USERNAME, PASSWORD, DB_NAME);
        }
    function query($sql)
        {
        return $this->conn->query($sql);
        }
    function vrni_link()
        {
        return $this->conn;
        }
    }
class userFunc
    {
    private $conn;
    function __construct()
        {
        return $this->conn = new DB();
        }
    function registracija($email, $password)
        {
        $ifexist = $this->conn->query("SELECT email FROM users WHERE email='$email'");
        if (mysqli_num_rows($ifexist) == 1)
            {
            return "exist";
            }
        else
            {
           
          return $this->conn->query("INSERT INTO users (email,password,created,active) VALUES ('$email','$password',now(),'1')");
            
            }
        }
    function prijava($email,$password)
        {
            session_start();
        $q = $this->conn->query("SELECT * FROM users WHERE email='$email'");
        if (mysqli_num_rows($q) == 1)
            {
            $row = mysqli_fetch_object($q);
            $preveri = password_verify($password,$row->password);
            if ($preveri)
                {
                $_SESSION['id'] = $row->id_user;
                $_SESSION['user'] = $row->email;
               return 1;
                }
            else
                {
                return 2;
                }
            }
        else
            {
           return 3;
            }
        }
        function preveriCookie($cookie)
        {
            session_start();
        $q = $this->conn->query("SELECT * FROM users WHERE email='$cookie'");
        if (mysqli_num_rows($q) == 1)
            {
            
            $row = mysqli_fetch_object($q);
         
                $_SESSION['id'] = $row->id_user;
                $_SESSION['user'] = $row->email;
               return 1;
                }else{
                    return 2;
                }
           
        }
    function widgetinit()
        {
        $q = $this->conn->query("SELECT * FROM widgets w,widget_types t  where w.widget_type = t.idwidget_types and user=" . $_SESSION['id']);
        $asd = [];
        while ($row = mysqli_fetch_object($q))
            {
            $row->size = new stdClass();
            $row->size->x = intval($row->x);
            $row->size->y = intval($row->y);
            $row->position = [2];
            $row->position[0] = intval($row->posY);
            $row->position[1] = intval($row->posX);
            $row->config = json_decode($row->config);
            foreach ($row->config as $key => $value)
                {
                $q2 = $this->conn->query("SELECT * FROM widget_options WHERE widget_type='$row->widget_type' and field='$key'");
                while ($row2 = mysqli_fetch_object($q2))
                    {
                    $row->config->$key = $row2;
                    if ($row2->inputType == "dropdown")
                        {
                        $row->config->$key->options = [];
                        $q3 = $this->conn->query("SELECT * FROM dropdown_options WHERE widget_option='$row2->idwidget_options'");
                        while ($row3 = mysqli_fetch_object($q3))
                            {
                            array_push($row->config->$key->options, $row3);
                          
                            }
                        }
                             if ($row2->inputType == "dropdown_news")
                        {
                                 $row->config->$key->source_option = [];
                                $q3 = $this->conn->query("SELECT id_source,sorting,sources.name,sources.type,source_type.name as typeName,
                                sources.name as sourceName FROM sources INNER JOIN source_type ON sources.type = source_type.id_source_type");
                                while ($row4 = mysqli_fetch_object($q3))
                                    {
                                    array_push($row->config->$key->source_option, $row4);
                                    } 
                        }
                    }
                $row->config->$key->value = $value;
                }
            array_push($asd, $row);
            }
        return $asd;
        }
    function getPoraba($mesec,$leto,$widget,$tMesec)
        {
        session_start();
        $array = [];
        $jsonTable = "";
        $table['cols'] = array(
            array(
                'label' => 'Vrsta',
                'type' => 'string'
            ) ,
            array(
                'label' => 'Odstotek',
                'type' => 'number'
            ) ,
        );
        if ($mesec != "")
            {
            $q = $this->conn->query("SELECT SUM(znesek) as znesek,vrsta FROM poraba INNER JOIN poraba_list on poraba_list.id=poraba.poraba_list where widget='$widget'  and year(datum) =$leto and month(datum)=$mesec GROUP BY vrsta");
            }
        else
            {
            $q = $this->conn->query("SELECT SUM(znesek) as znesek,vrsta FROM poraba   INNER JOIN poraba_list on poraba_list.id=poraba.poraba_list  where widget='$widget' and month(datum)='$tMesec'  GROUP BY vrsta");
            }
        while ($row = mysqli_fetch_array($q))
            {
            $temp = array();
            $temp[] = array(
                'v' => (string)$row['vrsta']
            );
            $temp[] = array(
                'v' => (float)$row['znesek']
            );
            $rows[] = array(
                'c' => $temp
            );
            $table['rows'] = $rows;
            }
        if (count($table) != 0)
            {
            $jsonTable = json_encode($table);
            }
        return $jsonTable;
        }
        function getGrafMonthandYear($widget)
        {
          session_start();
        $array = [];
        $q = $this->conn->query("SELECT DISTINCT DATE_FORMAT(`datum`,'%M')  as mesec, year(datum) as leto,month(datum) as mesec_id FROM `poraba` INNER JOIN poraba_list on poraba_list.id=poraba.poraba_list where poraba_list.widget='$widget'  GROUP BY `datum`");
    
        $test= new stdClass();
        $test->custom="Trenutni mesec";
        $test->leto=date('Y');
        $test->mesec_id=date('m');
        $test->mesec=date('F');
        while ($row = mysqli_fetch_assoc($q))
            {
            $array[] = $row;
            
            }
            
           
            
        return $array;
        }
    
    function widgetConfig($widget_id)
        {
            session_start();
        $q = $this->conn->query("SELECT * FROM widgets   where id_widget='$widget_id'  and user='$_SESSION[id]'");
        return mysqli_fetch_object($q);
        }
        function getSorting($id)
        {
        $q = $this->conn->query("SELECT sorting FROM sources   where id_source='$id'");
        return mysqli_fetch_assoc($q);
        }
    function getVrste()
        {
        $array = [];
        $q = $this->conn->query("SELECT * FROM vrsta");
        while ($row = mysqli_fetch_assoc($q))
            {
            $array[] = $row;
            }
        return $array;
        }
    function getAllPoraba($widget,$mesec)
        {
        session_start();
        $array = [];
        $q = $this->conn->query("SELECT znesek,vrsta,datum,id_poraba FROM poraba   INNER JOIN poraba_list on poraba_list.id=poraba.poraba_list where poraba_list.widget='$widget' and month(datum)='$mesec'   ORDER BY datum,vrsta DESC");
        while ($row = mysqli_fetch_assoc($q))
            {
            $array[] = $row;
            }
        return $array;
        }
    function deletePoraba($id)
        {
        return $this->conn->query("DELETE FROM poraba  WHERE id_poraba='$id'");
        }
    function getTodo($id)
        {
        $array = [];
        $test = [];
        $q = $this->conn->query("SELECT * FROM todo  where widget='$id' and done=0 and deadline >= now() order by level desc,deadline asc");
        //$q = $this->conn->query("SELECT * FROM widgets inner join todo on widgets.id_widget = todo.widget  where id_widget='$id' and user=". $_SESSION['id']);
        while ($row = mysqli_fetch_object($q))
            {
            array_push($array, $row);
            }
        return $array;
        }
        function getDogodek($id,$mesec)
        {
        $array = [];
        
        $q = $this->conn->query("SELECT * FROM events  where widget='$id' and start_date >= now() and month(start_date)= $mesec  order by start_date desc");
        //$q = $this->conn->query("SELECT * FROM widgets inner join todo on widgets.id_widget = todo.widget  where id_widget='$id' and user=". $_SESSION['id']);
        while ($row = mysqli_fetch_object($q))
            {
            array_push($array, $row);
            }
        return $array;
        }
    function addTodo($delo)
        {
        return $this->conn->query("INSERT INTO todo (delo,deadline,level,widget,done) values ('$delo->delo','$delo->deadline','$delo->level','$delo->id',0)");
        }
        function addDogodek($dogodek)
        {
        return $this->conn->query("INSERT INTO events (title,event_opis,start_date,widget) values ('$dogodek->title','$dogodek->opis','$dogodek->start','$dogodek->id')");
        }
    function addPoraba($poraba)
        {
        return $this->conn->query("insert into poraba (znesek,poraba_list,vrsta,datum,used) SELECT '$poraba->znesek',id,'$poraba->vrsta','$poraba->datum',1 FROM poraba_list WHERE widget='$poraba->widget 'limit 1");
        }
    function deleteTodo($id)
        {
        return $this->conn->query("DELETE FROM todo  WHERE id_todo='$id'");
        }
    function doneTodo($id)
        {
        return $this->conn->query("UPDATE todo SET done=1  WHERE id_todo='$id'");
        }
        function deleteDogodek($id)
        {
        return $this->conn->query("DELETE FROM events WHERE id_event='$id'");
        }
    function widgetupdate($posX, $posY, $idwid, $height, $width)
        {
        return $this->conn->query("UPDATE widgets SET posX = '$posY', posY = '$posX', y = '$height' , x = '$width'   WHERE id_widget='$idwid'");
        }
    function widgetVisibility($active, $idwid)
        {
        return $this->conn->query("UPDATE widgets SET active='$active'  WHERE id_widget='$idwid'");
        }
    function updateWidgetConfig($widget)
        {
        return $this->conn->query("UPDATE widgets SET ImeWidget = '$widget->imeWidget', config = '$widget->config'   WHERE id_widget='$widget->id_widget'");
        }
    function deleteWidget($id)
        {
        $query = $this->conn->query("DELETE FROM widgets WHERE id_widget=$id");
        return mysqli_affected_rows($this->conn->vrni_link());
        }
    function listWidgetTypes()
        {
        $query = $this->conn->query("SELECT * FROM widget_types");
        $rezultati = [];
        while ($row = mysqli_fetch_object($query))
            {
            $rezultat = new stdClass();
            $rezultat->id = $row->idwidget_types;
            $rezultat->name = $row->name;
            $rezultat->description = $row->description;
            $rezultat->options = array();
            $rezultat->dposX=$row->dposX;
            $rezultat->dposY=$row->dposY;
            $rezultat->selected = false;
            $q = $this->conn->query("SELECT * FROM widget_options WHERE widget_type = " . $rezultat->id);
            while ($row2 = mysqli_fetch_object($q))
                {
                $option = new stdClass();
                $option->id = $row2->idwidget_options;
                $option->name = $row2->name;
                $option->field = $row2->field;
                $option->inputType = $row2->inputType;
                if ($option->inputType == "dropdown" || $option->inputType == "dropdown_news")
                    {
                    $option->dropdownOptions = [];
                    $q2 = $this->conn->query("SELECT * FROM dropdown_options WHERE widget_option=" . $option->id);
                    while ($row3 = mysqli_fetch_object($q2))
                        {
                        array_push($option->dropdownOptions, $row3);
                        $source = new stdClass();
                        $source->id = $row3->id;
                        $source->option = $row3->option;
                        if ($source->option == "source")
                            {
                            $source->source_option = [];
                            $q3 = $this->conn->query("SELECT *,source_type.name as typeName,
                            sources.name as sourceName
                             FROM sources 
                            INNER JOIN source_type ON sources.type = source_type.id_source_type
                              WHERE dropdown_options_id=" . $source->id);
                            while ($row4 = mysqli_fetch_object($q3))
                                {
                                array_push($source->source_option, $row4);
                                }
                            array_push($option->dropdownOptions, $source);
                            }
                        }
                    }
                array_push($rezultat->options, $option);
                }
            array_push($rezultati, $rezultat);
            }
        return $rezultati;
        }
    function addWidget($widget)
        {
           
        echo $this->conn->query("INSERT INTO widgets (ImeWidget,active,user,widget_type,posX,posY,config) values ('$widget->imeWidget','$widget->active','$widget->user','$widget->widget_type','$widget->posX','$widget->posY','$widget->config')");
        if($widget->widget_type=9){
            return   $this->conn->query("INSERT INTO poraba_list (widget) SELECT id_widget FROM widgets WHERE user='$widget->user' ORDER BY id_widget DESC LIMIT 1");
        }
    }
     function addSources($sources)
    {
        for($i=0;$i<sizeof($sources);$i++){
   $result=$this->conn->query("INSERT INTO sources (type,id_source,name,dropdown_options_id,sorting) SELECT id_source_type,'".$sources[$i]->id ."','".$sources[$i]->name ."',14,'".$sources[$i]->sortBysAvailable ."' FROM source_type WHERE name='".$sources[$i]->category."'");
    }
    return $result;
    }
}
   
?>